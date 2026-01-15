// ai/vehicleAI.ts

type VehicleCategory = "Bike" | "Car" | "Truck";
type Location = "City" | "Suburb" | "Rural";

// --------------------------
// Fault Prediction
// --------------------------
export function predictFault(
    engine_status: number,
    battery_issue: boolean,
    noise_type: string
) {
    noise_type = noise_type.toLowerCase();

    if (engine_status === 0 && battery_issue) return "Battery Issue";
    if (noise_type === "knocking" || noise_type === "grinding") return "Engine Noise";

    return "Normal";
}

// --------------------------
// Severity Determination
// --------------------------
export function determineSeverity(fault: string) {
    switch (fault) {
        case "Battery Issue":
            return "Medium";
        case "Engine Noise":
            return "High";
        default:
            return "Low";
    }
}

// --------------------------
// Cost Estimation
// --------------------------
export function estimateCost(
    fault: string,
    vehicleCategory: VehicleCategory,
    location: Location
) {
    const baseCostMap: { [key: string]: number } = {
        "Normal": 50,
        "Battery Issue": 150,
        "Engine Noise": 300,
    };

    let cost = baseCostMap[fault] || 0;

    // Vehicle category adjustment
    switch (vehicleCategory) {
        case "Car": cost *= 1.5; break;
        case "Truck": cost *= 2; break;
        case "Bike": break; // base cost
    }

    // Location adjustment
    switch (location) {
        case "City": cost *= 1.2; break;
        case "Suburb": cost *= 1.0; break;
        case "Rural": cost *= 0.9; break;
    }

    return Math.round(cost);
}

// --------------------------
// Main function: Get AI Diagnosis
// --------------------------
export function getDiagnosis(
    engine_status: number,
    battery_issue: boolean,
    noise_type: string,
    vehicleCategory: VehicleCategory,
    location: Location
) {
    const fault = predictFault(engine_status, battery_issue, noise_type);
    const severity = determineSeverity(fault);
    const estimatedCost = estimateCost(fault, vehicleCategory, location);

    return {
        fault,
        severity,
        estimatedCost,
        disclaimer: "This is an estimated cost. Final price may vary after mechanic inspection."
    };
}
