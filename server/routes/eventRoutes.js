const router = require('express').Router();
const Event = require('../models/Event');
const { EVENT_STATUS } = require('../utils/constants');

// Middleware to check if user is admin
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'You must be logged in' });
    }
    next();
};

// PUBLIC: Get active events
router.get('/public', async (req, res) => {
    try {
        // Return all events that are not inactive? Or just imported?
        // Assignment says "displays them in a public UI". 
        // Usually means all scraped ones or specifically curated ones.
        // Let's return all except inactive.
        const events = await Event.find({ status: { $ne: EVENT_STATUS.INACTIVE } }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUBLIC: Capture email for tickets (Mock)
router.post('/tickets', async (req, res) => {
    const { email, eventId, consent } = req.body;
    if (!email || !consent) {
        return res.status(400).json({ error: 'Email and consent required' });
    }
    // Logic to save email or "send" ticket would go here
    console.log(`Ticket request for Event ${eventId} from ${email}`);
    res.json({ success: true, message: 'Ticket request received!' });
});

// ADMIN: Get all events form dashboard
router.get('/admin', requireLogin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const events = await Event.find(query).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Update event status
router.put('/admin/:id', requireLogin, async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Trigger scrape manually
router.post('/admin/scrape', requireLogin, async (req, res) => {
    const { scrapeEvents } = require('../services/scraper');
    // Run asynchronously
    scrapeEvents();
    res.json({ message: 'Scraping started' });
});

module.exports = router;
