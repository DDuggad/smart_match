from google import genai
from pymongo import MongoClient
import re

# ——— 1. Configure Gemini ——————————————————————————————————————————————
client = genai.Client(api_key="AIzaSyBL55AFLQa5FSAP3G9QbtlDFXzFe7jSgww")

def analyze_applicant_fit(job_info, candidate_info):
    prompt = f"""
You are an AI recruiting assistant. Analyze the candidate profile for the given job description.
Categorize the applicant into one of the following:
"Good Fit", "Maybe Fit", or "Not a Fit".

Respond in this exact format:

Job ID: <Job ID>
Applicant ID: <Applicant ID>
Fit Category: <Good Fit / Maybe Fit / Not a Fit>
Summary: <1-3 sentence explanation>

JOB DETAILS:
Job ID: {job_info['Job ID']}
Title: {job_info['Title']}
Description: {job_info['Description']}
Required Skills: {", ".join(job_info['Required Skills'])}
Experience Required: {job_info['Experience']} years

CANDIDATE PROFILE:
Applicant ID: {candidate_info['Applicant ID']}
Name: {candidate_info['Name']}
Resume Text: {candidate_info['Resume Text']}
Skills: {", ".join(candidate_info['Skills'])}
Experience: {candidate_info['Experience']} years
Education: {candidate_info['Education']}
"""
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    return response.text.strip()

# ——— 2. Parse Gemini’s Response ————————————————————————————————————————
def parse_response(text):
    """
    Parses:
      Job ID: ...
      Applicant ID: ...
      Fit Category: ...
      Summary: ...
    into a dict.
    """
    pattern = r"Job ID:\s*(.+)\nApplicant ID:\s*(.+)\nFit Category:\s*(.+)\nSummary:\s*(.+)"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        raise ValueError("Unexpected response format:\n" + text)
    return {
        "job_id": match.group(1).strip(),
        "applicant_id": match.group(2).strip(),
        "fit_category": match.group(3).strip(),
        "ai_summary": match.group(4).strip(),
    }

# ——— 3. Connect to MongoDB ——————————————————————————————————————————————
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["applicant_categorization"]
collection = db["applicant_results"]  # This will be created if it doesn't exist

# ——— 4. Example Data & Workflow ————————————————————————————————————————
job_data = {
    "Job ID": "AI-DEV-001",
    "Title": "AI Software Developer",
    "Description": "Looking for an experienced AI software developer to design ML systems and deploy Python APIs. Preferred skills include TensorFlow, LLMs, and cloud services.",
    "Required Skills": ["Python", "Machine Learning", "TensorFlow", "LLMs", "APIs"],
    "Experience": 3
}

candidate_data = {
    "Applicant ID": "CAND-2024-007",
    "Name": "Ananya Rao",
    "Resume Text": "Experienced in Python, ML model building, OpenAI APIs, backend systems. Developed Flask-based tools for AI projects.",
    "Skills": ["Python", "Machine Learning", "OpenAI", "Flask"],
    "Experience": 2,
    "Education": "B.Tech in Computer Science from NIT Trichy"
}

# 1) Get Gemini’s evaluation
raw_output = analyze_applicant_fit(job_data, candidate_data)
print("🔍 Raw Gemini Output:\n", raw_output, "\n")

# 2) Parse it
doc = parse_response(raw_output)
print("📄 Parsed Document:\n", doc, "\n")

# 3) Insert into MongoDB
insert_result = collection.insert_one(doc)
print(f"✅ Inserted document with _id: {insert_result.inserted_id}")
