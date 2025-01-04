"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const method_override_1 = __importDefault(require("method-override"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const passportConfig_js_1 = __importDefault(require("./config/passportConfig.js"));
// Passport configuration
(0, passportConfig_js_1.default)(passport_1.default);
mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/default_db");
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('DataBase connected');
});
// Session configuration
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Passport initialization
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', index_js_1.default);
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
