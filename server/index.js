require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
require('./config/passport');
const { initScheduler } = require('./services/scheduler');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
// import dotenv from "dotenv";
// dotenv.config();


const app = express();
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/events', eventRoutes);
app.use('/auth', authRoutes);

// Initialize Scheduler
initScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
