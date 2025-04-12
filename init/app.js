const mongoose = require('mongoose');
const applicant = require(`../models/applicant.js`)
main().then(res=>{
    console.log(`database connected`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');

  
}
applicant.deleteMany({});


const sampleApplicants = [
  {
    applicant_id: "APP1001",
    name: "Ananya Sharma",
    resume: `Final year Computer Science student with experience in Python and data structures. Built a mini project on fraud detection using machine learning.`,
    skills: "Python, Machine Learning, Data Structures, SQL",
    experience: "6-month internship at TCS as a data analyst",
    education: "B.Tech in Computer Science, VIT Vellore"
  },
  {
    applicant_id: "APP1002",
    name: "Rohit Singh",
    resume: `Front-end developer with a knack for clean UI/UX design. Created several responsive websites and contributed to open-source design systems.`,
    skills: "HTML, CSS, JavaScript, Figma, Bootstrap",
    experience: "Freelance web design for 5+ clients",
    education: "B.E. in Information Technology, BMS College"
  },
  {
    applicant_id: "APP1003",
    name: "Sneha Iyer",
    resume: `Backend developer with experience in Node.js, Express, and MongoDB. Built REST APIs for a real-time chat application.`,
    skills: "Node.js, Express, MongoDB, Git, REST APIs",
    experience: "1-year experience at DevSolve Inc.",
    education: "B.Tech in IT, SRM University"
  },
  {
    applicant_id: "APP1004",
    name: "Arjun Mehta",
    resume: `Software engineering enthusiast with a solid understanding of algorithms and problem-solving. Active contributor to LeetCode and Codeforces.`,
    skills: "C++, Java, Algorithms, Git",
    experience: "No formal experience, solved 300+ coding problems",
    education: "B.E. in Computer Engineering, Thapar University"
  },
  {
    applicant_id: "APP1005",
    name: "Neha Kapoor",
    resume: `Cloud computing intern with hands-on knowledge in AWS, Docker, and CI/CD pipelines. Completed certification in AWS Cloud Practitioner.`,
    skills: "AWS, Docker, Jenkins, GitHub Actions",
    experience: "6-month internship at Cloudify Labs",
    education: "B.Tech in Computer Science, PES University"
  },
  {
    applicant_id: "APP1006",
    name: "Kunal Verma",
    resume: `Full-stack developer with strong skills in MERN stack. Built an e-commerce platform as a personal project.`,
    skills: "MongoDB, Express, React, Node.js",
    experience: "Worked on freelance MERN projects for startups",
    education: "B.Tech in Computer Science, LNMIIT Jaipur"
  },
  {
    applicant_id: "APP1007",
    name: "Megha Rathi",
    resume: `AI/ML enthusiast with hands-on projects in image classification and recommendation systems. Python is her primary language.`,
    skills: "Python, Scikit-learn, Pandas, TensorFlow",
    experience: "Research intern at IIIT Hyderabad",
    education: "B.Sc. in Computer Science, Delhi University"
  },
  {
    applicant_id: "APP1008",
    name: "Aman Qureshi",
    resume: `Cybersecurity beginner with a deep interest in network security and ethical hacking. Participated in CTFs and workshops.`,
    skills: "Linux, Wireshark, Nmap, Burp Suite",
    experience: "Security workshop participant and bug bounty hunter",
    education: "B.Tech in IT, Chandigarh University"
  },
  {
    applicant_id: "APP1009",
    name: "Ishika Nanda",
    resume: `Creative front-end developer with passion for animations and transitions. Experienced in working with GSAP and CSS effects.`,
    skills: "HTML, CSS, JavaScript, GSAP, Adobe XD",
    experience: "Interned at a local UI/UX design studio",
    education: "B.Des in Interaction Design, NIFT"
  },
  {
    applicant_id: "APP1010",
    name: "Siddharth Jain",
    resume: `Mobile app developer skilled in Flutter and Firebase. Created 3 personal apps and published 2 on the Play Store.`,
    skills: "Flutter, Dart, Firebase, REST API",
    experience: "Freelance mobile developer",
    education: "B.Tech in Electronics, NSIT Delhi"
  },
  {
    applicant_id: "APP1011",
    name: "Priya Nair",
    resume: `Tech-savvy student with leadership roles in coding clubs. Interested in DevOps and cloud architecture.`,
    skills: "AWS, Docker, Kubernetes, GitOps",
    experience: "Cloud Bootcamp by Google Developer Student Club",
    education: "B.Tech in Computer Science, Amrita Vishwa Vidyapeetham"
  },
  {
    applicant_id: "APP1012",
    name: "Ravi Teja",
    resume: `Blockchain developer with solid understanding of smart contracts and Solidity. Created an NFT minting app.`,
    skills: "Solidity, Ethereum, Web3.js, Hardhat",
    experience: "Interned at a blockchain startup",
    education: "B.Tech in Computer Engineering, Manipal University"
  },
  {
    applicant_id: "APP1013",
    name: "Sanya Bansal",
    resume: `Passionate about data science and analytics. Loves working with numbers and presenting insights using visualizations.`,
    skills: "Excel, Power BI, Python, Tableau",
    experience: "Data intern at PwC India",
    education: "B.Sc. in Statistics, St. Xavier's Mumbai"
  },
  {
    applicant_id: "APP1014",
    name: "Mohammed Faiz",
    resume: `Game developer with Unity and C# experience. Built a 2D platformer as a college capstone project.`,
    skills: "Unity, C#, Blender, Git",
    experience: "Indie game development and testing",
    education: "B.Sc. in Game Design, MIT Pune"
  },
  {
    applicant_id: "APP1015",
    name: "Kritika Sood",
    resume: `QA engineer with a detail-oriented mindset. Automated several test cases using Selenium during her internship.`,
    skills: "Selenium, Java, TestNG, JIRA",
    experience: "Intern at Tech Mahindra QA team",
    education: "B.Tech in Information Systems, Banasthali Vidyapith"
  }
];


  applicant.insertMany(sampleApplicants);

  
  const { spawn } = require('child_process');
  const bodyParser = require('body-parser');
  
  
  
  
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  
  
  
