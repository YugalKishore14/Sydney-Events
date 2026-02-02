const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, default: 'admin' }, // Simplified: anyone who logs in is an admin for this assignment, or check against whitelist
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
