"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Roommate Schema
const roommateSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    personalInfo: {
        name: String,
        age: Number,
        gender: String,
        occupation: String,
        education: String,
        hometown: String,
    },
    interests: {
        hobbies: [String],
        music: [String],
        movies: [String],
        sports: [String],
    },
    social: {
        bio: String,
        profileImage: String,
        socialMedia: {
            facebook: String,
            instagram: String,
        },
    },
    questionnaire: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
    },
    preferences: {
        overview: {
            rentRange: Number,
            bedrooms: Number,
            bathrooms: Number,
            minSize: Number,
        },
        details: {
            AC: Boolean,
            Parking: Boolean,
            Balcony: Boolean,
            Furnished: Boolean,
            Elevator: Boolean,
            "Pet Friendly": Boolean,
            "Smoking Allowed": Boolean,
        },
        leaseDuration: {
            duration: Number,
            moveInDateStart: Date,
        },
        location: {
            address: {
                street: String,
                city: String,
                coordinates: {
                    type: [Number],
                    index: "2dsphere",
                },
            },
            radius: Number,
        },
    },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Apartment" }],
    dislikes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Apartment" }],
    matches: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Apartment" }],
});
// Create and export the Roommate model
const Roommate = (0, mongoose_1.model)("Roommate", roommateSchema);
exports.default = Roommate;
