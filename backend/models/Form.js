const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
        {
            type: { type: String, enum: ['text', 'multiple-choice', 'radio', 'checkbox'], required: true },
            questionText: { type: String, required: true },
            options: [String], // for multiple-choice/radio/checkbox
            required: { type: Boolean, default: false }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', formSchema);
