const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const auth = require('../middleware/auth');
const Form = require('../models/Form');

// Submit response
router.post('/:formId', async (req, res) => {
    try {
        const { answers } = req.body;
        const response = await Response.create({ formId: req.params.formId, answers });
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({ message: 'Error submitting response' });
    }
});

// Get responses for a form (creator only)
router.get('/:formId', auth, async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        if (form.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        const responses = await Response.find({ formId: req.params.formId });
        res.json(responses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
