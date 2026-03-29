const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main entry
app.get('/', (req, res) => {
    res.send('Form-Builder API is running');
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes (to be added)
console.log('Registering routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Auth routes registered');
app.use('/api/forms', require('./routes/forms'));
app.use('/api/responses', require('./routes/responses'));

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
