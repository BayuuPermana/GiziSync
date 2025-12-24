const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    kitchen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kitchen',
        required: true,
        index: true // Indexed for faster filtering by kitchen
    },
    date: {
        type: Date,
        default: Date.now,
        index: true // Indexed for faster range queries and sorting
    },
    items: [{
        commodity: {
            type: String, // e.g., "Rice", "Egg"
            required: true,
            index: true // Indexed for faster commodity-specific queries
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

// Compound index to optimize finding the latest report per kitchen
reportSchema.index({ kitchen: 1, date: -1 });

module.exports = mongoose.model('Report', reportSchema);
