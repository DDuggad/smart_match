from google import genai

# Initialize Gemini with API key
client = genai.Client(api_key="AIzaSyBL55AFLQa5FSAP3G9QbtlDFXzFe7jSgww")

# Function to analyze a candidate against job description
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
    return response.text

# Example job data
job_data = {
    "Job ID": "AI-DEV-001",
    "Title": "AI Software Developer",
    "Description": "Looking for an experienced AI software developer to design ML systems and deploy Python APIs. Preferred skills include TensorFlow, LLMs, and cloud services.",
    "Required Skills": ["Python", "Machine Learning", "TensorFlow", "LLMs", "APIs"],
    "Experience": 3
}

# Example candidate data
candidate_data = {
    "Applicant ID": "CAND-2025-057",
    "Name": "Dolly Singh",
    "Resume Text": "Experienced in java, C, HTML, Python & swimming champion",
    "Skills": ["Python", "C", "chatGPT"],
    "Experience": 1,
    "Education": "B.Tech in Computer Science from BMS College of Engineering"
}

# Run the analysis
result = analyze_applicant_fit(job_data, candidate_data)
print("🎯 Gemini AI Evaluation:\n")
print(result)
