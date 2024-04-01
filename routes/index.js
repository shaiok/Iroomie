const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoute');
const profileRoutes = require('./profiles');
const preferencesRoutes = require('./preferencesRoute');
const matchesRoutes = require('./matchesRoute');
const apartmentsRoutes = require('./apartmentsRoute');
const chatroomsRoutes = require('./chatroomsRoute');
const messagesRoutes = require('./messagesRoute');
const adminRoutes = require('./adminRoute');

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/matches', matchesRoutes);
router.use('/apartments', apartmentsRoutes);
router.use('/chatrooms', chatroomsRoutes);
router.use('/messages', messagesRoutes);
router.use('/admin', adminRoutes);

module.exports = router;