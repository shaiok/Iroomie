const express = require('express');
const app = express();

// Import route modules
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const preferencesRoutes = require('./routes/preferences');
const matchesRoutes = require('./routes/matches');
const apartmentsRoutes = require('./routes/apartments');
const chatroomsRoutes = require('./routes/chatrooms');
const messagesRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');

// Mount routes
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/preferences', preferencesRoutes);
app.use('/matches', matchesRoutes);
app.use('/apartments', apartmentsRoutes);
app.use('/chatrooms', chatroomsRoutes);
app.use('/messages', messagesRoutes);
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT = 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});