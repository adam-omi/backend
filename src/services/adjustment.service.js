/**
 * Applies manual business rules to the base AI price.
 * @param {number} basePrice - The raw price returned by the Python AI
 * @param {object} propertyData - The full data object from the frontend
 */
function applyManualAdjustments(basePrice, propertyData) {
    let finalPrice = basePrice;
    let appliedAdjustments = []; // We keep track of these to show the user later

    if (propertyData.parking === 'Underground') {
        finalPrice += 50000;
        appliedAdjustments.push({ factor: 'Underground parking', impact: '+50,000 PLN' });
    } else if (propertyData.parking === 'Outdoor') {
        finalPrice += 20000;
        appliedAdjustments.push({ factor: 'Outdoor parking', impact: '+20,000 PLN' });
    }

    if (propertyData.balcony && propertyData.balcony !== 'None') {
        let percentageBonus = 0;

        if (propertyData.sunOrientation === 'South') {
            percentageBonus = 0.07; // 7% bonus
        } else if (propertyData.sunOrientation === 'East' || propertyData.sunOrientation === 'West') {
            percentageBonus = 0.05; // 5% bonus
        } else if (propertyData.sunOrientation === 'North') {
            percentageBonus = 0.02; // 2% bonus
        } else {
            percentageBonus = 0.03; // Mixed/Default
        }

        if (percentageBonus > 0) {
            const addedValue = basePrice * percentageBonus;
            finalPrice += addedValue;
            appliedAdjustments.push({ 
                factor: `${propertyData.balcony} (${propertyData.sunOrientation}-facing)`, 
                impact: `+${(percentageBonus * 100).toFixed(1)}%` 
            });
        }
    }

    // If it's a high floor with no elevator, we drop the price
    if (propertyData.elevator === 'No' && propertyData.floor > 2) {
        const penalty = basePrice * 0.05; // 5% penalty
        finalPrice -= penalty;
        appliedAdjustments.push({ factor: 'No elevator (Floor > 2)', impact: '-5.0%' });
    }

    // You can add endless rules here for condition, heating type, etc!

    return {
        finalPrice: Math.round(finalPrice),
        adjustments: appliedAdjustments
    };
}

module.exports = {
    applyManualAdjustments
};


