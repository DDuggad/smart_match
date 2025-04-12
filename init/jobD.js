//data initialisation

const mongoose = require('mongoose');

main().then(res=>{
    console.log(`database connected`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');

}

const jobDes = require(`../models/jobDes.js`)
jobDes.deleteMany({});


const sampleJobs =[
  {
    job_id: 'ENG101',
    cName: 'Tech Solutions India',
    title: 'Software Engineer',
    description: 'Develop and maintain software applications. Collaborate with a team to design and implement new features.',
    req_skill: 'JavaScript, React, Node.js, Git',
    experience: '2-5 years'
  },
  {
    job_id: 'MKT205',
    cName: 'Global Marketing Group',
    title: 'Marketing Manager',
    description: 'Lead marketing campaigns, analyze market trends, and manage the marketing team.',
    req_skill: 'Digital Marketing, SEO/SEM, Content Strategy, Analytics',
    experience: '5-8 years'
  },
  {
    job_id: 'DES310',
    cName: 'Creative Studios Ltd.',
    title: 'UI/UX Designer',
    description: 'Design intuitive and visually appealing user interfaces and experiences for web and mobile applications.',
    req_skill: 'Figma, Sketch, Adobe XD, User Research, Prototyping',
    experience: '3-6 years'
  },
  {
    job_id: 'SAL402',
    cName: 'Enterprise Sales Corp',
    title: 'Sales Executive',
    description: 'Identify and pursue new sales opportunities, build client relationships, and achieve sales targets.',
    req_skill: 'Sales Strategy, Negotiation, CRM Software, Client Management',
    experience: '1-3 years'
  },
  {
    job_id: 'ANA515',
    cName: 'Data Insights Platform',
    title: 'Data Analyst',
    description: 'Collect, clean, analyze, and interpret large datasets to provide actionable insights and recommendations.',
    req_skill: 'SQL, Python, Data Visualization (Tableau, Power BI), Statistical Analysis',
    experience: '2-4 years'
  },
  {
    job_id: 'HRM601',
    cName: 'People First Organization',
    title: 'HR Manager',
    description: 'Manage employee relations, recruitment processes, performance management, and HR policies.',
    req_skill: 'Recruitment, Employee Relations, HR Policies, Performance Management',
    experience: '4-7 years'
  },
  {
    job_id: 'FIN720',
    cName: 'Financial Solutions Inc.',
    title: 'Financial Analyst',
    description: 'Analyze financial data, prepare reports, develop financial models, and provide investment recommendations.',
    req_skill: 'Financial Modeling, Forecasting, Valuation, Accounting Principles',
    experience: '3-5 years'
  },
  {
    job_id: 'OPS808',
    cName: 'Efficient Operations Group',
    title: 'Operations Manager',
    description: 'Oversee and optimize daily operations, improve efficiency, and ensure smooth workflow across departments.',
    req_skill: 'Process Optimization, Supply Chain Management, Project Management, Team Leadership',
    experience: '5-8 years'
  }
];



  jobDes.insertMany(sampleJobs);