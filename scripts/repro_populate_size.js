
const mongoose = require('mongoose');

// Mock Schemas based on real ones
const kitchenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { address: String, city: String, province: String },
    capacity: { type: Number, default: 0 },
    operatorName: String,
    contactNumber: String
}, { timestamps: true });

// Measure size of full object vs optimized object
const kitchenData = {
    _id: new mongoose.Types.ObjectId(),
    name: "Dapur Berkah Jakarta Selatan",
    location: {
        address: "Jl. Sudirman No. 10",
        city: "Jakarta Selatan",
        province: "DKI Jakarta"
    },
    capacity: 500,
    operatorName: "Budi Santoso",
    contactNumber: "081234567890",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
};

const optimizedData = {
    _id: kitchenData._id,
    name: kitchenData.name
};

const fullSize = JSON.stringify(kitchenData).length;
const optimizedSize = JSON.stringify(optimizedData).length;
const saving = fullSize - optimizedSize;
const savingPercent = (saving / fullSize) * 100;

console.log("Full Kitchen Object Size (approx bytes):", fullSize);
console.log("Optimized Kitchen Object Size (approx bytes):", optimizedSize);
console.log(`Savings: ${saving} bytes per record (${savingPercent.toFixed(2)}%)`);

// Mock 50 reports
const reportCount = 50;
const totalSaving = saving * reportCount;
console.log(`Total payload reduction for ${reportCount} reports: ${(totalSaving / 1024).toFixed(2)} KB`);
