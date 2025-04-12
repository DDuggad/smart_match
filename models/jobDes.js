const mongoose = require('mongoose');

main().then(res=>{
    console.log(`database connected`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');

}


const jobSchema = new mongoose.Schema({
    job_id:{
        type:String,
        maxlength:100,
        unique:true
    },
    cName:{
        type:String,
        maxlength:100
    },
    title:{
        type:String,
        maxlength : 50,

    },
    description:{
        type:String,
        maxlength:800,
    },
    req_skill:{
        type:String,
        maxlength:500
    },
    experience:{
        type:String,
        maxlength:500
    }
    
})

const jobDes = mongoose.model('jobDes',jobSchema);

module.exports = jobDes ;