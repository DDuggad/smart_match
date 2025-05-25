from google import genai
from pymongo import MongoClient
import re
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ——— 1. Initialize Gemini client ——————————————————————————————————————————
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ——— 2. Connect to MongoDB —————————————————————————————————————————————
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["smartMatch"]
jobs_col       = db["jobDes"]
applicants_col = db["applicant"]
results_col    = db["applicants_results"]

# ——— 3. Load all jobs and applicants ——————————————————————————————————————
jobs       = list(jobs_col.find())
applicants = list(applicants_col.find())
print(f"🔄 Loaded {len(jobs)} jobs and {len(applicants)} applicants.\n")

if not jobs or not applicants:
    print("❌ No data to process. Exiting.")
    exit(1)

# ——— 4. Helper: call Gemini —————————————————————————————————————————————
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
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"[Error] Gemini call failed for Job {job_info['Job ID']} / Applicant {candidate_info['Applicant ID']}: {e}")
        return None

# ——— 5. Helper: parse Gemini’s structured response ————————————————————————
def parse_response(text):
    pattern = (
        r"Job ID:\s*(.+)\n"
        r"Applicant ID:\s*(.+)\n"
        r"Fit Category:\s*(.+)\n"
        r"Summary:\s*([\s\S]+)$"
    )
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        print(f"[Warning] Could not parse response:\n{text}\n")
        return None
    return {
        "job_id":       match.group(1).strip(),
        "applicant_id": match.group(2).strip(),
        "fit_category": match.group(3).strip(),
        "ai_summary":   match.group(4).strip(),
    }

# ——— 6. Main processing loop —————————————————————————————————————————————
total = 0
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

        print(f"▶ Processing Job {job_info['Job ID']} / Applicant {candidate_info['Applicant ID']}...")
        raw_output = analyze_applicant_fit(job_info, candidate_info)
        if not raw_output:
            print("   ✖ No response from Gemini, skipping.\n")
            continue

        parsed = parse_response(raw_output)
        if not parsed:
            print("   ✖ Parsing failed, skipping.\n")
            continue

        try:
            result = results_col.insert_one(parsed)
            print(f"   ✔ Inserted _id={result.inserted_id}\n")
            total += 1
        except Exception as e:
            print(f"   [Error] MongoDB insert failed: {e}\n")

        # throttle to avoid hitting rate limits
        time.sleep(1)

print(f"✅ Completed processing. Total records inserted: {total}")
