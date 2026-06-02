const axios = require('axios');

// Fetch the URL from your .env file, or use the default localhost
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api/v1/predict';

/**
 * Sends property data to the Python ML service and returns the prediction.
 */
async function getValuationFromAI(propertyData) {
    try {
        // We map your frontend data to the exact schema the Python API expects
        const payload = {
            address: propertyData.address || "",
            city: propertyData.city,
            country: "Poland", 
            area_sqm: propertyData.areaSqm,
            rooms: propertyData.rooms,
            year_built: propertyData.yearBuilt
        };

        const response = await axios.post(ML_SERVICE_URL, payload);
        return response.data; // This contains the estimated_value, confidence, etc.

    } catch (error) {
        console.error("❌ Error talking to Python ML Service:", error.message);
        throw new Error("Failed to communicate with the AI model.");
    }
}

module.exports = {
    getValuationFromAI
};