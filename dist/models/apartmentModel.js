"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 3. Define the Apartment schema
const apartmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    info: {
        overview: {
            title: String,
            description: String,
            propertyType: String,
            totalCapacity: Number,
            availableRooms: Number,
        },
        location: {
            address: {
                street: String,
                city: String,
            },
            coordinates: {
                type: [Number],
                index: "2dsphere",
            },
            nearbyPlaces: [String],
        },
        specifications: {
            size: Number,
            bedrooms: Number,
            bathrooms: Number,
            floorNumber: Number,
        },
        roommates: [String],
        financials: {
            rent: Number,
            securityDeposit: Number,
        },
        leaseTerms: {
            leaseDuration: String,
            availableFrom: Date,
        },
        images: [String],
    },
    amenities: {
        general: [String],
        kitchen: [String],
        bathroom: [String],
        bedroom: [String],
        outdoor: [String],
        entertainment: [String],
        safety: [String],
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
    questionnaire: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
    },
    preferences: {
        ageRange: [Number],
        gender: [String],
        occupations: [String],
        sharedInterests: [String],
    },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Roommate" }],
    dislikes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Roommate" }],
    matches: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Roommate" }],
});
// 4. Create and export the Apartment model
const Apartment = (0, mongoose_1.model)("Apartment", apartmentSchema);
exports.default = Apartment;
