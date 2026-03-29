const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const auth = require('../middleware/auth');

// Create form
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const form = await Form.create({ userId: req.user.id, title, description, questions });
        res.status(201).json(form);
    } catch (err) {
        res.status(400).json({ message: 'Error creating form' });
    }
});

// Get all forms for a user
router.get('/', auth, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user.id });
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single form (public)
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.json(form);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a form
router.delete('/:id', auth, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        if (form.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
        await Form.deleteOne({ _id: req.params.id });
        res.json({ message: 'Form deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
