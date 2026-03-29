const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [
        {
            questionId: { type: String, required: true }, // the ID of the question in the form
            answer: { type: mongoose.Schema.Types.Mixed } // could be string, array of strings, etc.
        }
    ],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
