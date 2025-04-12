const mongoose = require('mongoose');

main().then(res=>{
    console.log(`database connected`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartMatch');

  
}

const appSchema = new mongoose.Schema({
    applicant_id:{
        type:String,
        maxlength:100,
        unique:true
    },

    
    name:{
        type:String,
        maxlength : 50,

    },
    resume:{
        type:String,
        maxlength:800,
    },
    skills:{
        type:String,
        maxlength:500
    },
    experience:{
        type:String,
        maxlength:500
    },
    education:{
        type:String,
        maxlength : 500
    }
    
})

const Applicant =  mongoose.model('Applicant',appSchema);

module.exports = Applicant;