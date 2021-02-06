const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true,
    },
    messageHash: {
        type: String,
        required: true,
    },
    rawTransaction: {
        type: String,
        required: true,
    },
    transactionHash: {
        type: String,
        required: true,
    },
    r: {
        type: String,
        required: true,
    },
    s: {
        type: String,
        required: true
    },
    v: {
        type: String,
        required: true,
    },
    filled: {
        type: Boolean,
        required: false,
        default: false
    },
    cancelled: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Transaction", TransactionSchema);