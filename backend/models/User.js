const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'kitchen'], // admin = Government, kitchen = Kitchen Operator
        default: 'kitchen'
    },
    kitchenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kitchen',
        required: function () { return this.role === 'kitchen'; },
        index: true // Indexed for faster lookups by kitchen
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
