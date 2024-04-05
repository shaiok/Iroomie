const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    existimgRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    geoLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    address: String,
    rent: Number,
    amenities: [String],
    bedrooms: Number,
    bathrooms: Number,
    about: String,
    bio: { type: mongoose.Schema.Types.ObjectId, ref: 'questionsSchema' },
    importance: { type: mongoose.Schema.Types.ObjectId, ref: 'questionsSchema' },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
