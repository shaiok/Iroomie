"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestions = exports.setApartmentPreferences = exports.apartmentActions = exports.updateApartment = exports.getActivity = exports.getMatches = void 0;
const roommateModel_1 = __importDefault(require("../models/roommateModel"));
const apartmentModel_1 = __importDefault(require("../models/apartmentModel"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const matchingAlgorithm_1 = __importDefault(require("../utils/matchingAlgorithm"));
const getMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the apartment
        const myApartment = yield apartmentModel_1.default.findById(req.user._id);
        if (!myApartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        // Fetch the apartment's questionnaire from the database
        const apartmentQuestionnaire = yield questionModel_1.default.findById(myApartment.questionnaire);
        if (!apartmentQuestionnaire) {
            return res.status(400).json({ message: "Apartment questionnaire not found" });
        }
        if (!myApartment.matches || myApartment.matches.length === 0) {
            return res.status(400).json({ message: "No matches found for the apartment" });
        }
        // Fetch matches and their questionnaires
        const matches = yield Promise.all(myApartment.matches.map((matchId) => __awaiter(void 0, void 0, void 0, function* () {
            const match = yield roommateModel_1.default.findById(matchId);
            if (!match || !match.questionnaire)
                return null;
            const matchQuestionnaire = yield questionModel_1.default.findById(match.questionnaire);
            if (!matchQuestionnaire)
                return null;
            return { match, matchQuestionnaire };
        })));
        // Filter and map matches
        const formattedMatches = matches
            .filter((result) => result !== null) // Filter out null matches
            .map(({ match, matchQuestionnaire }) => {
            var _a, _b, _c, _d;
            const compatibilityScore = (0, matchingAlgorithm_1.default)(apartmentQuestionnaire, matchQuestionnaire);
            return {
                match,
                matchInfo: {
                    image: ((_a = match.social) === null || _a === void 0 ? void 0 : _a.profileImage) || "No image available",
                    score: compatibilityScore,
                    title: ((_b = match.personalInfo) === null || _b === void 0 ? void 0 : _b.name) || "No name provided",
                    subTitle: `${(_d = (_c = match.personalInfo) === null || _c === void 0 ? void 0 : _c.age) !== null && _d !== void 0 ? _d : "Unknown"} years old`,
                },
            };
        })
            .sort((a, b) => b.matchInfo.score - a.matchInfo.score);
        res.status(200).json(formattedMatches);
    }
    catch (err) {
        console.error("Error fetching matches for apartment:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMatches = getMatches;
const getActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the apartment
        const myApartment = yield apartmentModel_1.default.findById(req.user._id);
        if (!myApartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        if (!myApartment.likes || !myApartment.dislikes) {
            return res.status(400).json({ message: "No likes or dislikes found for the apartment" });
        }
        // Fetch the apartment's questionnaire from the database
        const apartmentQuestionnaire = yield questionModel_1.default.findById(myApartment.questionnaire);
        if (!apartmentQuestionnaire) {
            return res.status(400).json({ message: "Apartment questionnaire not found" });
        }
        // Helper function to fetch roommates and their questionnaires
        const formatRoommates = (roommateIds) => __awaiter(void 0, void 0, void 0, function* () {
            const roommates = yield Promise.all(roommateIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const roommate = yield roommateModel_1.default.findById(id);
                if (!roommate || !roommate.questionnaire)
                    return null;
                const roommateQuestionnaire = yield questionModel_1.default.findById(roommate.questionnaire);
                if (!roommateQuestionnaire)
                    return null;
                return { roommate, roommateQuestionnaire };
            })));
            return roommates
                .filter((result) => result !== null) // Filter out null roommates
                .map(({ roommate, roommateQuestionnaire }) => {
                const compatibilityScore = (0, matchingAlgorithm_1.default)(apartmentQuestionnaire, roommateQuestionnaire);
                return {
                    roommate,
                    score: compatibilityScore,
                };
            });
        });
        // Format likes and dislikes
        const likes = yield formatRoommates(myApartment.likes);
        const dislikes = yield formatRoommates(myApartment.dislikes);
        res.status(200).json({ likes, dislikes });
    }
    catch (err) {
        console.error("Error fetching activity for apartment:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getActivity = getActivity;
const updateApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { questionnaire } = _a, otherFields = __rest(_a, ["questionnaire"]);
        let updatedApartment = req.user;
        if (questionnaire) {
            const updatedQuestionnaire = yield questionModel_1.default.findByIdAndUpdate(updatedApartment.questionnaire, questionnaire, { new: true, runValidators: true });
            if (!updatedQuestionnaire) {
                return res.status(404).json({ message: 'Questionnaire not found' });
            }
            updatedApartment.questionnaire = updatedQuestionnaire._id;
        }
        Object.assign(updatedApartment, otherFields);
        yield updatedApartment.save();
        res.json(updatedApartment);
    }
    catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: err.errors });
        }
    }
});
exports.updateApartment = updateApartment;
const apartmentActions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { targetId } = req.params;
        const { action } = req.query;
        const myApartment = req.user;
        const roommate = yield roommateModel_1.default.findById(targetId);
        if (!roommate) {
            return res.status(404).json({ message: 'Roommate not found' });
        }
        switch (action) {
            case 'like':
                if (!((_a = myApartment.likes) === null || _a === void 0 ? void 0 : _a.includes(roommate._id))) {
                    myApartment.likes = (_b = myApartment.likes) !== null && _b !== void 0 ? _b : [];
                    myApartment.likes.push(roommate._id);
                    myApartment.dislikes = (_d = (_c = myApartment.dislikes) === null || _c === void 0 ? void 0 : _c.filter((id) => !id.equals(roommate._id))) !== null && _d !== void 0 ? _d : [];
                }
                break;
            case 'dislike':
                if (!((_e = myApartment.dislikes) === null || _e === void 0 ? void 0 : _e.includes(roommate._id))) {
                    myApartment.dislikes = (_f = myApartment.dislikes) !== null && _f !== void 0 ? _f : [];
                    myApartment.dislikes.push(roommate._id);
                    myApartment.likes = (_h = (_g = myApartment.likes) === null || _g === void 0 ? void 0 : _g.filter((id) => !id.equals(roommate._id))) !== null && _h !== void 0 ? _h : [];
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
        yield myApartment.save();
        return res.json({ message: 'Action successful' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.apartmentActions = apartmentActions;
const setApartmentPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apartment = req.user;
        const { ageRange, gender, occupations, sharedInterests } = req.body;
        apartment.preferences = {
            ageRange,
            gender,
            occupations,
            sharedInterests,
        };
        yield apartment.save();
        res.status(200).json({
            message: 'Apartment preferences updated successfully',
            apartment: apartment,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating apartment preferences' });
    }
});
exports.setApartmentPreferences = setApartmentPreferences;
const getSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Fetch the apartment
        const apartment = yield apartmentModel_1.default.findById(req.user._id);
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        const dislikes = (_a = apartment.dislikes) !== null && _a !== void 0 ? _a : [];
        const likes = (_b = apartment.likes) !== null && _b !== void 0 ? _b : [];
        const matches = (_c = apartment.matches) !== null && _c !== void 0 ? _c : [];
        // Fetch the apartment's questionnaire
        const apartmentQuestionnaire = yield questionModel_1.default.findById(apartment.questionnaire);
        if (!apartmentQuestionnaire) {
            return res.status(400).json({ message: "Apartment questionnaire not found" });
        }
        // Fetch all roommates
        const roommates = yield roommateModel_1.default.find();
        // Filter and map compatible roommates
        const compatibleRoommates = yield Promise.all(roommates
            .filter((result) => !dislikes.includes(result._id) &&
            !likes.includes(result._id) &&
            !matches.includes(result._id))
            .map((roommate) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // Fetch roommate's questionnaire
            const roommateQuestionnaire = yield questionModel_1.default.findById(roommate.questionnaire);
            if (!roommateQuestionnaire)
                return null;
            const compatibilityScore = (0, matchingAlgorithm_1.default)(apartmentQuestionnaire, roommateQuestionnaire);
            return {
                roommate,
                score: compatibilityScore,
                sortOption: {
                    score: compatibilityScore,
                    age: ((_a = roommate.personalInfo) === null || _a === void 0 ? void 0 : _a.age) || "Unknown",
                    date: (_d = (_c = (_b = apartment.info) === null || _b === void 0 ? void 0 : _b.leaseTerms) === null || _c === void 0 ? void 0 : _c.availableFrom) !== null && _d !== void 0 ? _d : new Date(),
                },
            };
        })));
        // Filter out null results and sort by score
        const sortedRoommates = compatibleRoommates
            .filter((result) => result !== null)
            .sort((a, b) => b.score - a.score);
        res.status(200).json(sortedRoommates);
    }
    catch (err) {
        console.error("Error fetching suggestions:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSuggestions = getSuggestions;
