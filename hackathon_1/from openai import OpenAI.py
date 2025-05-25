from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the OpenAI client with API key from environment variables
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def generate_job_requirements(job_profile):
    """
    Generate detailed job requirements based on a given job profile.
    """
    prompt = (
        f"Generate detailed job requirements for a job posting based on the following job profile: {job_profile}. "
        "Include essential skills, experience, responsibilities, and qualifications."
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[{"role": "user", "content": prompt}]
    )
    
    job_requirements = response.choices[0].message.content
    return job_requirements

def categorize_applicant(job_description, applicant_resume, selection_criteria):
    """
    Categorize an applicant by analyzing the job description (or requirements),
    the applicant's resume, and provided selection criteria.
    """
    prompt = (
        "Analyze the following job description and resume. Based on the provided selection criteria, "
        "determine if the applicant is a 'Good Fit', 'Maybe Fit', or 'Not a Fit'. Provide a brief summary explaining your decision.\n\n"
        f"Job Description:\n{job_description}\n\n"
        f"Resume:\n{applicant_resume}\n\n"
        f"Selection Criteria:\n{selection_criteria}"
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[{"role": "user", "content": prompt}]
    )
    
    categorization = response.choices[0].message.content
    return categorization

# -------------------------
# Main Workflow
# -------------------------

# Step 1: Generate job requirements from a given job profile.
job_profile = "Software Developer with AI integration expertise" #Isme baad me input lena hai
print("Generating job requirements for the job profile...")
job_requirements = generate_job_requirements(job_profile)
print("Job Requirements Generated:\n")
print(job_requirements)
print("\n" + "-"*60 + "\n")

# Step 2: Categorize an applicant based on the generated job requirements.
applicant_resume = (
    "The candidate has 5 years of experience in Python development, has led several AI-related projects, "
    "and demonstrates strong problem-solving and backend development skills."
)
selection_criteria = (
    "Candidates must demonstrate robust Python skills, proven AI project experience, and effective communication abilities."
)
print("Categorizing the applicant based on the generated job requirements...")
categorization_result = categorize_applicant(job_requirements, applicant_resume, selection_criteria)
print("Categorization Result:\n")
print(categorization_result)
