const router = require('express').Router();
const passport = require('passport');

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to admin dashboard
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard`);
    }
);

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    });
});

// Current User
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;
