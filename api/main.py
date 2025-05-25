from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import uvicorn
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="JobHunt API", description="Backend API for JobHunt application")

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["smartMatch"]

class MatchResult(BaseModel):
    job_id: str
    applicant_id: str
    fit_category: str
    ai_summary: str

@app.get("/api/matches", response_model=List[MatchResult])
async def get_matches(job_id: Optional[str] = None, applicant_id: Optional[str] = None):
    """Get matches filtered by job_id or applicant_id"""
    query = {}
    if job_id:
        query["job_id"] = job_id
    if applicant_id:
        query["applicant_id"] = applicant_id
        
    matches = list(db.applicants_results.find(query, {"_id": 0}))
    return matches

@app.get("/api/statistics")
async def get_statistics():
    """Get statistics about matches and applications"""
    job_count = db.jobdes.count_documents({})
    applicant_count = db.applicants.count_documents({})
    match_count = db.applicants_results.count_documents({})
    
    good_fits = db.applicants_results.count_documents({"fit_category": "Good Fit"})
    maybe_fits = db.applicants_results.count_documents({"fit_category": "Maybe Fit"})
    not_fits = db.applicants_results.count_documents({"fit_category": "Not a Fit"})
    
    return {
        "total_jobs": job_count,
        "total_applicants": applicant_count,
        "total_matches": match_count,
        "good_fits": good_fits,
        "maybe_fits": maybe_fits,
        "not_fits": not_fits,
        "match_rate": round(good_fits / match_count * 100, 2) if match_count > 0 else 0
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
