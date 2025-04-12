// require('dotenv').config(); // loads .env

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const applicant = require(`./models/applicant.js`)
const applicants_results = require(`./models/result.js`)
const {spawn} = require(`child_process`)
app.use(bodyParser.urlencoded({ extended: false }));


main().then(res=>{
    console.log(`database connected`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');

  
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const jobDes = require(`./models/jobDes.js`)

// app.use(express.json()); // to parse JSON request bodies

// app.post('/api/smartmatch', async (req, res) => {
//   const { resume, jobDescription } = req.body;

//   // Debug logs
//   console.log("API Key from .env:", process.env.OPENAI_API_KEY);
//   console.log("Received Resume:", resume);
//   console.log("Received Job Description:", jobDescription);

//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a helpful job matcher." },
//           {
//             role: "user",
//             content: `Compare this resume and job description, and give a score out of 100 with reasoning.\n\nResume:\n${resume}\n\nJob Description:\n${jobDescription}`
//           }
//         ]
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//         }
//       }
//     );

//     res.json({ result: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error("Error from OpenAI:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || error.message });
//   }
// });

app.listen(8080, () => {
  console.log("✅ Server is running on http://localhost:8080");
});

app.get('/home',(req,res)=>{
    res.send(`this is root page`)
})

app.get('/listings',async (req,res)=>{
  const allJobs = await jobDes.find({})
  
  res.render(`index.ejs`,{allJobs})
})

app.get('/listing/new',(req,res)=>{
  res.render(`newJob.ejs`);
})

app.post('/listings',async (req,res)=>{
  let data = req.body;
  const newJob = await new jobDes( {
    job_id: data.job_id,
    cName : data.cName,
    title : data.title,
    description: data.description,
    req_skill : data.req_skill,
    experience : data.experience
  })
  newJob.save()
  
  res.redirect(`/listings`)
})

app.get('/users',async (req,res)=>{
  let users = await applicant.find({})
  res.render(`allUsers.ejs` , {users})
})

app.get('/users/new', (req,res)=>{
  res.render(`newUser.ejs`)       
})
app.post('/users', async(req,res)=>{
  const userData = req.body;
  const newUser = await new applicant({
    applicant_id: userData.applicant_id,
    name: userData.name,
    resume:userData.resume,
    skills:userData.skills,
    experience:userData.experience,
    education:userData.education
  })
  newUser.save()
  res.redirect(`/users`)
})

app.get('/users/:id',async (req,res)=>{
  const {id} = req.params;
  const data = await applicants_results.find({
    applicant_id:`${id}`,
    fit_category: { $in: ['Good Fit', 'Maybe Fit'] }
  })
  const companies = await jobDes.find({id:data.job_id}) 
  res.render(`userInfo`,{data,companies})

  
  
  
})

app.get('/listings/:id',async (req,res)=>{
  const {id} = req.params;
  console.log(id)
  const data = await applicants_results.find({
    job_id : `${id}`,
    fit_category: { $in: ['Good Fit', 'Maybe Fit'] }
  })
  console.log(data)
  
  
  
  res.render(`companyinfo.ejs`,{data});

  
  
  
})







