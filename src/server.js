require('dotenv').config();
const express = require('express');
const cors = require('cors');
const predictionRoutes = require('./routes/prediction.routes');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to talk to this backend
app.use(express.json()); // Allow reading JSON body data

// Register your routes
app.use('/api/v1', predictionRoutes);

// Simple health check route
app.get('/health', (req, res) => {
    res.json({ status: 'UP', message: 'Node.js Backend is running' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Estate-AI Node Backend running on port ${PORT}`);
});