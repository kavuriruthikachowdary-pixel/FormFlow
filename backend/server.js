const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error('❌ CRITICAL: MONGO_URI is not defined in the environment!');
}

app.use(cors());
app.use(express.json());

// Main entry
app.get('/', (req, res) => {
    res.send('Form-Builder API is running');
});

// Database connection middleware
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in Vercel environment variables. Check Settings > Environment Variables.');
    }
    return mongoose.connect(process.env.MONGO_URI);
};

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: 'DB connection error', error: err.message });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/responses', require('./routes/responses'));

// Only listen if not on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing from environment variables!');
}

module.exports = app;
