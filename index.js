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

  // Spawn the Python script after saving
  const pythonProcess = spawn('python', ['final.py'], { cwd: __dirname });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  // Redirect back to the listings page
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
  const data = await applicants_results.find({
    job_id: `${id}`,
    fit_category: { $in: ['Good Fit', 'Maybe Fit'] }
  });
  

  
  res.render('companyinfo.ejs', { data });
});
