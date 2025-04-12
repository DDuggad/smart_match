const mongoose = require('mongoose');

const matchResultSchema = new mongoose.Schema({
  applicant_id: {
    type: String,
    ref: 'applicant',
    required: true
  },
  job_id: {
    type: String,
    ref: 'jobDes',
    required: true
  },
  fit_category: {
    type: String,
    enum: ['Good Fit', 'Maybe Fit', 'Not a Fit'],
    required: true
  },
  ai_summary:{
    type:String,

  }
});
const applicants_results = mongoose.model('applicants_results',matchResultSchema);

module.exports = applicants_results;
