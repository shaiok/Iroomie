
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import methodOverride from 'method-override';
import path from 'path';

import routes from './routes/index.js';
import passportConfig from './config/passportConfig.js';

// Passport configuration
passportConfig(passport);

// Connect to MongoDB

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    SESSION_SECRET: string;
  }
}
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/default_db" );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('DataBase connected')
})

// Session configuration
// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`Received request for ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

