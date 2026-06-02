const crypto = require('crypto'); // Built-in Node tool to generate IDs
const mlService = require('../services/ml.service');
const adjustmentService = require('../services/adjustment.service');

// 🧪 TEMPORARY DATABASE: We will store results here until Kayra finishes PostgreSQL
const temporaryDatabase = new Map();

// --- ROUTE 1: Handle the Form Submission ---
async function createPrediction(req, res) {
    try {
        const propertyData = req.body;
        console.log("📥 Received form data!");

        const mappedDataForAI = {
            address: propertyData.street || propertyData.address || "",
            city: propertyData.city || "Warsaw",
            area_sqm: parseFloat(propertyData.area || propertyData.areaSqm || 0),
            rooms: parseInt(propertyData.rooms || 1),
            year_built: parseInt(propertyData.yearBuilt || 2000)
        };

        // Call AI and apply adjustments
        const aiResult = await mlService.getValuationFromAI(mappedDataForAI);
        const modifiedResult = adjustmentService.applyManualAdjustments(aiResult.estimated_value, propertyData);

        // Generate a unique ID for this valuation
        const predictionId = crypto.randomUUID();

        // Format the data EXACTLY how the React ResultPage expects it
        const finalData = {
            id: predictionId,
            price: modifiedResult.finalPrice,
            price_range: [
                modifiedResult.finalPrice * 0.95, // Min price
                modifiedResult.finalPrice * 1.05  // Max price
            ],
            condition_score: 8.5,
            adjustments: modifiedResult.adjustments,
            details: aiResult.explanation
        };

        // Save it to our temporary database so the ResultPage can fetch it
        temporaryDatabase.set(predictionId, finalData);

        // Reply to the frontend with the ID!
        return res.status(200).json(finalData);

    } catch (error) {
        console.error("❌ Backend Error:", error.message);
        return res.status(500).json({ error: "Failed to calculate valuation." });
    }
}

// --- ROUTE 2: Handle the Result Page Request ---
async function getPredictionResult(req, res) {
    try {
        // Grab the ID from the URL (e.g., /api/result/12345 -> id = 12345)
        const { id } = req.params;
        
        console.log(`🔎 ResultPage is asking for data for ID: ${id}`);

        // Look up the ID in our temporary database
        const result = temporaryDatabase.get(id);

        if (!result) {
            return res.status(404).json({ error: "Valuation not found!" });
        }

        // Send the full data to the ResultPage to display
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: "Server error fetching result" });
    }
}

module.exports = {
    createPrediction,
    getPredictionResult
};