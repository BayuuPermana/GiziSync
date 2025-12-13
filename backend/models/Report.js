const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    kitchen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kitchen',
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    items: [{
        commodity: {
            type: String, // e.g., "Rice", "Egg"
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String, // e.g., "kg", "liter"
            required: true
        },
        pricePerUnit: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    totalExpenditure: {
        type: Number,
        required: true
    },
    receiptImageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
