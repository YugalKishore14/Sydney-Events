const mongoose = require('mongoose');
const { EVENT_STATUS } = require('../utils/constants');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sourceUrl: { type: String, required: true, unique: true },
    sourceName: { type: String, default: "Eventbrite" },
    description: { type: String },
    city: { type: String, default: "Sydney" },
    location: { type: String }, // Keep for backward compatibility or specific venue
    date: { type: Date, default: Date.now }, // Default to now if not parsed, or required? User didn't specify required.
    lastScrapedAt: { type: Date },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: Object.values(EVENT_STATUS),
        default: EVENT_STATUS.NEW
    },
    // Optional/Legacy fields from previous version if needed, keeping them loose
    externalId: { type: String },
    dateString: { type: String },
    price: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
