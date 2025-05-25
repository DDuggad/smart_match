// require('dotenv').config(); // loads .env

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const applicant = require('./models/applicant.js');
const applicants_results = require('./models/result.js');
const { spawn } = require('child_process');

app.use(bodyParser.urlencoded({ extended: false }));

main().then(res => {
  console.log(`database connected`);
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const jobDes = require('./models/jobDes.js');

// Uncomment and configure if using JSON API endpoints
// app.use(express.json());

// Add static file serving
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
  console.log("✅ Server is running on http://localhost:8080");
});

app.get('/home', (req, res) => {
  res.render(`home.ejs`);
});

app.get('/listings', async (req, res) => {
  const allJobs = await jobDes.find({});
  res.render('index.ejs', { allJobs });
});

app.get('/listing/new', (req, res) => {
  res.render('newJob.ejs');
});

app.post('/listings', async (req, res) => {
  // Save the new job details to MongoDB
  let data = req.body;
  const newJob = new jobDes({
    job_id: data.job_id,
    cName: data.cName,
    title: data.title,
    description: data.description,
    req_skill: data.req_skill,
    experience: data.experience
  });
  await newJob.save();

  // Start Python script in the background without waiting for it to complete
  const pythonProcess = spawn('python', ['final.py'], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  });

  // Unref the child process so it runs independently
  pythonProcess.unref();

  console.log("Started AI matching process in background");

  // Redirect immediately without waiting for Python to finish
  res.redirect('/listings');
});

app.get('/users', async (req, res) => {
  let users = await applicant.find({});
  res.render('allUsers.ejs', { users });
});

app.get('/users/new', (req, res) => {
  res.render('newUser.ejs');
});

app.post('/users', async (req, res) => {
  const userData = req.body;
  const newUser = new applicant({
    applicant_id: userData.applicant_id,
    name: userData.name,
    resume: userData.resume,
    skills: userData.skills,
    experience: userData.experience,
    education: userData.education
  });
  await newUser.save();

  // Start Python script in the background without waiting for it to complete
  const pythonProcess = spawn('python', ['final.py'], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  });

  // Unref the child process so it runs independently
  pythonProcess.unref();

  console.log("Started AI matching process in background");

  // Redirect immediately without waiting for Python to finish
  res.redirect('/users');
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const data = await applicants_results.find({
    applicant_id: `${id}`,
    fit_category: { $in: ['Good Fit', 'Maybe Fit'] }
  });
  const companies = await jobDes.find({ id: data.job_id });
  res.render('userInfo', { data, companies });
});

app.get('/listings/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // Get the matched candidates from results collection
  const data = await applicants_results.find({
    job_id: `${id}`,
    fit_category: { $in: ['Good Fit', 'Maybe Fit'] }
  });

  // Fetch complete candidate information for each match
  const candidates = [];
  for (const match of data) {
    const applicantInfo = await applicant.findOne({ applicant_id: match.applicant_id });
    if (applicantInfo) {
      candidates.push({
        ...match.toObject(),
        name: applicantInfo.name,
        skills: applicantInfo.skills,
        experience: applicantInfo.experience,
        education: applicantInfo.education,
        resume: applicantInfo.resume
      });
    }
  }

  // Get the job details
  const jobDetails = await jobDes.findOne({ job_id: id });

  res.render('companyinfo.ejs', { data: candidates, jobDetails });
});

// Add Python API proxy
app.use('/api', async (req, res) => {
  try {
    // Forward request to Python FastAPI server
    const pythonApiUrl = `http://localhost:8000/api${req.url}`;
    const response = await axios({
      method: req.method,
      url: pythonApiUrl,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Python API error:', error.message);
    res.status(500).send({ error: 'Failed to communicate with Python API' });
  }
});

// Add dashboard route that uses Python API
app.get('/dashboard', async (req, res) => {
  try {
    const stats = await axios.get('http://localhost:8000/api/statistics');
    res.render('dashboard.ejs', { stats: stats.data });
  } catch (error) {
    console.error('Failed to get statistics:', error.message);
    res.render('dashboard.ejs', { stats: null, error: 'Could not load statistics' });
  }
});
