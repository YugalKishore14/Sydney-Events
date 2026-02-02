const mongoose = require('mongoose');
const { EVENT_STATUS } = require('../utils/constants');

const eventSchema = new mongoose.Schema({
    externalId: { type: String, unique: true }, // To avoid duplicates during scraping
    title: { type: String, required: true },
    date: { type: Date, required: true }, // Normalized date
    dateString: { type: String }, // Original date string display
    location: { type: String },
    description: { type: String },
    sourceUrl: { type: String, required: true },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: Object.values(EVENT_STATUS),
        default: EVENT_STATUS.NEW
    },
    price: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
