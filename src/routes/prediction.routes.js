const express = require('express');
const router = express.Router();
const multer = require('multer');
const predictionController = require('../controllers/prediction.controller');

// Set up Multer to handle the multipart/form-data and store photos temporarily
const upload = multer({ dest: 'uploads/' });

// 1. This catches the exact URL the frontend is generating: /api/v1/api/predict
// 2. upload.any() unpacks the form data and makes req.body readable again!
router.post('/api/predict', upload.any(), predictionController.createPrediction);

router.get('/api/result/:id', predictionController.getPredictionResult);

module.exports = router;