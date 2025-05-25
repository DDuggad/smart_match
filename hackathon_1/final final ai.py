#!/usr/bin/env python3
print("Content-Type: text/html\n")  # CGI header

from google import genai
from pymongo import MongoClient
import re
import time
import sys

# ——— 1. Initialize Gemini client ——————————————————————————————————————————
API_KEY = "AIzaSyBL55AFLQa5FSAP3G9QbtlDFXzFe7jSgww"
client = genai.Client(api_key=API_KEY)

# ——— 2. Connect to MongoDB —————————————————————————————————————————————
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "smartMatch"
JOB_COL    = "jobdes"
APP_COL    = "applicants"
RESULT_COL = "applicants_results"

mongo_client = MongoClient(MONGO_URI)

# Verify database exists
if DB_NAME not in mongo_client.list_database_names():
    print(f"❌ Database '{DB_NAME}' not found.")
    sys.exit(1)
db = mongo_client[DB_NAME]

# Verify collections exist
cols = db.list_collection_names()
for col in (JOB_COL, APP_COL):
    if col not in cols:
        print(f"❌ Collection '{col}' not found in '{DB_NAME}'.")
        sys.exit(1)

jobs_col       = db[JOB_COL]
applicants_col = db[APP_COL]
results_col    = db[RESULT_COL]  # will be created if missing

# Print counts
job_count       = jobs_col.count_documents({})
applicant_count = applicants_col.count_documents({})
print(f"🔢 Found {job_count} jobs and {applicant_count} applicants in '{DB_NAME}'.")
if job_count == 0 or applicant_count == 0:
    print("❌ One or both source collections are empty.")
    sys.exit(1)

# ——— 3. Helper: call Gemini —————————————————————————————————————————————
def analyze_applicant_fit(job_info, candidate_info):
    prompt = f"""
You are an AI recruiting assistant. Analyze the candidate profile for the given job description.
Categorize the applicant into one of the following: "Good Fit", "Maybe Fit", or "Not a Fit".
Respond in this exact format:

Job ID: <Job ID>
Applicant ID: <Applicant ID>
Fit Category: <Good Fit / Maybe Fit / Not a Fit>
Summary: <1-3 sentence explanation>

JOB DETAILS:
Job ID: {job_info['Job ID']}
Title: {job_info['Title']}
Description: {job_info['Description']}
Required Skills: {', '.join(job_info['Required Skills'])}
Experience Required: {job_info['Experience']} years

CANDIDATE PROFILE:
Applicant ID: {candidate_info['Applicant ID']}
Name: {candidate_info['Name']}
Resume Text: {candidate_info['Resume Text']}
Skills: {', '.join(candidate_info['Skills'])}
Experience: {candidate_info['Experience']} years
Education: {candidate_info['Education']}
"""
    try:
        resp = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return resp.text.strip()
    except Exception as e:
        print(f"[Error] Gemini API failed for Job {job_info['Job ID']} / Applicant {candidate_info['Applicant ID']}: {e}")
        return None

# ——— 4. Helper: parse Gemini’s response ————————————————————————————————————
def parse_response(text):
    pattern = (
        r"Job ID:\s*(.+)\n"
        r"Applicant ID:\s*(.+)\n"
        r"Fit Category:\s*(.+)\n"
        r"Summary:\s*([\s\S]+)$"
    )
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        print(f"[Warning] Could not parse response:\n{text}\n")
        return None
    return {
        "job_id":       m.group(1).strip(),
        "applicant_id": m.group(2).strip(),
        "fit_category": m.group(3).strip(),
        "ai_summary":   m.group(4).strip(),
    }

# ——— 5. Main processing loop —————————————————————————————————————————————
jobs       = list(jobs_col.find())
applicants = list(applicants_col.find())
inserted   = 0
sleep_interval = 60 / 14  # ~4.29 seconds per request to stay under 14 rpm

for job in jobs:
    job_info = {
        "Job ID":          job.get("job_id"),
        "Title":           job.get("title"),
        "Description":     job.get("description"),
        "Required Skills": job.get("req_skills") if isinstance(job.get("req_skills"), list)
                                 else [s.strip() for s in job.get("req_skills", "").split(",")],
        "Experience":      job.get("experience")
    }

    for applicant in applicants:
        candidate_info = {
            "Applicant ID":  applicant.get("applicant_id"),
            "Name":          applicant.get("name"),
            "Resume Text":   applicant.get("resume"),
            "Skills":        applicant.get("skills") if isinstance(applicant.get("skills"), list)
                                 else [s.strip() for s in applicant.get("skills", "").split(",")],
            "Experience":    applicant.get("experience"),
            "Education":     applicant.get("education")
        }

        # Skip if already processed
        existing = results_col.find_one({
            "job_id": job_info["Job ID"],
            "applicant_id": candidate_info["Applicant ID"]
        })
        if existing:
            print(f"→ Skipping Job {job_info['Job ID']} / Applicant {candidate_info['Applicant ID']} (already exists)")
            continue

        print(f"▶ Processing Job {job_info['Job ID']} / Applicant {candidate_info['Applicant ID']}...")
        raw = analyze_applicant_fit(job_info, candidate_info)
        if not raw:
            continue

        parsed = parse_response(raw)
        if not parsed:
            continue

        try:
            res = results_col.insert_one(parsed)
            print(f"   ✔ Inserted _id={res.inserted_id}\n")
            inserted += 1
        except Exception as e:
            print(f"   [Error] MongoDB insert failed: {e}\n")

        time.sleep(sleep_interval)

print(f"✅ Done. Total new records inserted: {inserted}")
