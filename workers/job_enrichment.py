import time
import logging
from pymongo import MongoClient
import requests
import json
import os
from dotenv import load_dotenv
import schedule

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler("job_enrichment.log"), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["smartMatch"]

def enrich_job_listings():
    """Enhance job listings with additional information from external APIs"""
    logger.info("Starting job data enrichment process")
    
    jobs = list(db.jobdes.find({"enriched": {"$ne": True}}))
    logger.info(f"Found {len(jobs)} jobs to enrich")
    
    for job in jobs:
        try:
            # Example: Get salary range estimates based on job title
            job_title = job.get("title", "")
            
            # Simulate API call - in production would connect to external service
            salary_data = {
                "min": 50000,
                "max": 120000,
                "currency": "USD",
                "period": "yearly"
            }
            
            # Update the job with enriched data
            db.jobdes.update_one(
                {"_id": job["_id"]},
                {"$set": {
                    "salary_range": salary_data,
                    "enriched": True,
                    "last_enriched": time.time()
                }}
            )
            logger.info(f"Enriched job {job['job_id']}")
            
        except Exception as e:
            logger.error(f"Error enriching job {job.get('job_id')}: {str(e)}")
    
    logger.info("Job enrichment process complete")

def run_scheduled_tasks():
    """Run all scheduled tasks"""
    enrich_job_listings()

if __name__ == "__main__":
    # Run immediately once
    run_scheduled_tasks()
    
    # Then schedule to run every hour
    schedule.every(1).hours.do(run_scheduled_tasks)
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)
