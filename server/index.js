require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
require('./config/passport');
const { initScheduler } = require('./services/scheduler');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

// import dotenv from "dotenv";
// dotenv.config();


const app = express();
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5000', credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/events', eventRoutes);
app.use('/auth', authRoutes);

// Initialize Scheduler
initScheduler();

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

