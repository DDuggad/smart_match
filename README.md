# JobHunt - AI-Powered Job Matching Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/DDuggad/smart_match/refs/heads/main/treeeeeeeeeeee.png" alt="JobHunt Logo" width="150">
</p>

JobHunt is an innovative AI-powered platform designed to match job seekers with suitable job opportunities and help employers find qualified candidates. The platform analyzes applicant profiles and job descriptions using advanced AI to determine compatibility, providing intelligent matching and recommendations.

> This project was initially developed as a hackathon project, and was subsequently enhanced and optimized by me with additional features, improved UI, and backend optimizations.

## Features

- **AI-Powered Matching:** Uses Google's Gemini API to analyze and match candidates with job listings
- **Smart Categorization:** Automatically categorizes matches as "Good Fit", "Maybe Fit", or "Not a Fit"
- **Detailed Summaries:** Provides AI-generated explanations for each match
- **User-Friendly Interface:** Clean, responsive design that works on both desktop and mobile devices
- **Real-time Processing:** Background processing ensures quick results without disrupting user experience

## Technology Stack

### Frontend
- EJS (Embedded JavaScript Templates)
- HTML5/CSS3
- JavaScript

### Backend
- Node.js with Express.js
- Python for AI processing and analytics
- MongoDB for data storage

### AI/ML
- Google Gemini AI API for natural language processing
- Custom matching algorithms

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/DDuggad/smart_match.git
   cd smart_match
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start MongoDB:
   ```
   mongod
   ```

6. Start the Node.js server:
   ```
   node index.js
   ```

7. The application will be available at `http://localhost:8080/home`

## How It Works

1. **Job Listings:** Employers post job opportunities with details like required skills, experience, and job descriptions
2. **Candidate Profiles:** Job seekers create profiles with their skills, experience, and education
3. **AI Matching:** Our AI system analyzes the compatibility between candidates and jobs
4. **Categorization:** Each match is categorized based on compatibility score
5. **Summary Generation:** AI provides a detailed explanation of why a candidate matches a job

## Team

This project was developed as a hackathon project by:

- Divyansh Duggad
- Chirag Mukhija
- Priyanka Chourasia
- Dolly Singh

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chirag Mukhija for major contributions to the project
- Priyanka Chourasia for UI/frontend development assistance
- Dolly Singh for logo design suggestions

- Google Gemini AI for providing the API
- MongoDB for the database solution
- Node.js and Express for the backend framework
