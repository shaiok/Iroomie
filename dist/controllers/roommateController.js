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
exports.updateUser = exports.roommateActions = exports.setRoommatePreferences = exports.getSuggestions = exports.getActivity = exports.getMatches = void 0;
const roommateModel_1 = __importDefault(require("../models/roommateModel"));
const apartmentModel_1 = __importDefault(require("../models/apartmentModel"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const matchingAlgorithm_1 = __importDefault(require("../utils/matchingAlgorithm"));
const utilsFunction_1 = require("../utils/utilsFunction");
const getMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the roommate and its questionnaire reference
        const roommate = yield roommateModel_1.default.findById(req.user._id);
        if (!roommate) {
            return res.status(404).json({ message: "Roommate not found" });
        }
        // Fetch the roommate's questionnaire from the database
        const roommateQuestionnaire = yield questionModel_1.default.findById(roommate.questionnaire);
        if (!roommateQuestionnaire) {
            return res.status(400).json({ message: "Roommate questionnaire not found" });
        }
        if (!roommate.matches || roommate.matches.length === 0) {
            return res.status(400).json({ message: "No matches found for the user" });
        }
        // Fetch matches and their questionnaires
        const matches = yield Promise.all(roommate.matches.map((matchId) => __awaiter(void 0, void 0, void 0, function* () {
            const match = yield apartmentModel_1.default.findById(matchId);
            if (!match)
                return null;
            const matchQuestionnaire = yield questionModel_1.default.findById(match.questionnaire);
            if (!matchQuestionnaire)
                return null;
            return { match, matchQuestionnaire };
        })));
        // Filter and map matches
        const formattedMatches = matches
            .filter((match) => match !== null && match.matchQuestionnaire !== null) // Filter out null matches and ensure matchQuestionnaire exists
            .map(({ match, matchQuestionnaire }) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            const compatibilityScore = (0, matchingAlgorithm_1.default)(roommateQuestionnaire, matchQuestionnaire);
            const roommateCoordinates = (_c = (_b = (_a = roommate.preferences) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.address) === null || _c === void 0 ? void 0 : _c.coordinates;
            const matchCoordinates = (_e = (_d = match.info) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.coordinates;
            let distance = 0;
            if (roommateCoordinates && matchCoordinates) {
                distance = (0, utilsFunction_1.calculateDistance)(roommateCoordinates, matchCoordinates);
                // Use distance as needed
            }
            else {
                ;
                // Handle the case where either coordinate is undefined
                console.error("Coordinates are missing for either roommate or match.");
            }
            return {
                match,
                matchInfo: {
                    image: (_g = (_f = match.info) === null || _f === void 0 ? void 0 : _f.images) === null || _g === void 0 ? void 0 : _g[0],
                    score: compatibilityScore,
                    title: `${(_l = (_k = (_j = (_h = match.info) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.address) === null || _k === void 0 ? void 0 : _k.street) !== null && _l !== void 0 ? _l : "Unknown street"}, ${(_q = (_p = (_o = (_m = match.info) === null || _m === void 0 ? void 0 : _m.location) === null || _o === void 0 ? void 0 : _o.address) === null || _p === void 0 ? void 0 : _p.city) !== null && _q !== void 0 ? _q : "Unknown city"}`,
                    subTitle: `${(_s = (_r = match.info) === null || _r === void 0 ? void 0 : _r.financials) === null || _s === void 0 ? void 0 : _s.rent}₪ /m`,
                    distance,
                },
            };
        });
        res.status(200).json({ matches: formattedMatches });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            // Safely access the error's message property
            res.status(500).json({ message: "An error occurred", error: error.message });
        }
        else {
            // Handle unexpected error types
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getMatches = getMatches;
const getActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roommate = yield roommateModel_1.default.findById(req.user._id).populate('questionnaire');
        if (!roommate) {
            return res.status(404).json({ message: "Roommate not found" });
        }
        if (!roommate.likes || !roommate.dislikes) {
            return res.status(400).json({ message: "No likes or dislikes found for the user" });
        }
        if (!roommate.questionnaire) {
            return res.status(400).json({ message: "Roommate questionnaire is undefined" });
        }
        // Fetch the apartment's questionnaire from the database
        const roommateQuestionnaire = yield questionModel_1.default.findById(roommate.questionnaire);
        if (!roommateQuestionnaire) {
            return res.status(400).json({ message: "Apartment questionnaire not found" });
        }
        // Helper to format apartments
        const formatApartments = (apartmentIds) => __awaiter(void 0, void 0, void 0, function* () {
            const apartments = yield Promise.all(apartmentIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const apartment = yield apartmentModel_1.default.findById(id);
                if (!apartment)
                    return null;
                const apartmentQuestionnaire = yield questionModel_1.default.findById(apartment.questionnaire);
                if (!apartmentQuestionnaire)
                    return null;
                return { apartment, apartmentQuestionnaire };
            })));
            return apartments
                .filter((result) => result !== null && result.apartmentQuestionnaire !== null)
                .map(({ apartment, apartmentQuestionnaire }) => {
                const compatibilityScore = (0, matchingAlgorithm_1.default)(roommateQuestionnaire, apartmentQuestionnaire);
                return { apartment, score: compatibilityScore };
            });
        });
        // Format likes and dislikes
        const likes = yield formatApartments(roommate.likes);
        const dislikes = yield formatApartments(roommate.dislikes);
        res.json({ likes, dislikes });
    }
    catch (err) {
        console.error("Error fetching activity:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getActivity = getActivity;
const getSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const roommate = yield roommateModel_1.default.findById(req.user._id).populate('questionnaire');
        if (!roommate) {
            return res.status(404).json({ message: "Roommate not found" });
        }
        const dislikes = (_a = roommate.dislikes) !== null && _a !== void 0 ? _a : [];
        const likes = (_b = roommate.likes) !== null && _b !== void 0 ? _b : [];
        const matches = (_c = roommate.matches) !== null && _c !== void 0 ? _c : [];
        if (!roommate.questionnaire) {
            return res.status(400).json({ message: "Roommate questionnaire is undefined" });
        }
        // Fetch the apartment's questionnaire
        const roommateQuestionnaire = yield questionModel_1.default.findById(roommate.questionnaire);
        if (!roommateQuestionnaire) {
            return res.status(400).json({ message: "Roommate questionnaire not found" });
        }
        // Fetch all apartments and their questionnaires
        const apartments = yield apartmentModel_1.default.find();
        const apartmentsWithQuestionnaires = yield Promise.all(apartments.map((apartment) => __awaiter(void 0, void 0, void 0, function* () {
            const questionnaire = yield questionModel_1.default.findById(apartment.questionnaire);
            if (!questionnaire)
                return null;
            return { apartment, questionnaire };
        })));
        // Filter compatible apartments
        const compatibleApartments = apartmentsWithQuestionnaires
            .filter((result) => result !== null &&
            !dislikes.includes(result.apartment._id) &&
            !likes.includes(result.apartment._id) &&
            !matches.includes(result.apartment._id))
            .map(({ apartment, questionnaire }) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const compatibilityScore = (0, matchingAlgorithm_1.default)(roommateQuestionnaire, questionnaire);
            const roommateCoordinates = (_c = (_b = (_a = roommate.preferences) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.address) === null || _c === void 0 ? void 0 : _c.coordinates;
            const apartmentCoordinates = (_e = (_d = apartment.info) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.coordinates;
            const distance = roommateCoordinates && apartmentCoordinates
                ? (0, utilsFunction_1.calculateDistance)(roommateCoordinates, apartmentCoordinates)
                : null;
            return {
                apartment,
                score: compatibilityScore,
                sortOption: {
                    score: compatibilityScore,
                    rent: (_h = (_g = (_f = apartment.info) === null || _f === void 0 ? void 0 : _f.financials) === null || _g === void 0 ? void 0 : _g.rent) !== null && _h !== void 0 ? _h : "N/A",
                    distance: distance !== null && distance !== void 0 ? distance : "N/A",
                    date: (_l = (_k = (_j = apartment.info) === null || _j === void 0 ? void 0 : _j.leaseTerms) === null || _k === void 0 ? void 0 : _k.availableFrom) !== null && _l !== void 0 ? _l : new Date(),
                },
            };
        });
        // Sort compatible apartments by score
        compatibleApartments.sort((a, b) => b.score - a.score);
        res.json(compatibleApartments);
    }
    catch (err) {
        console.error("Error fetching suggestions:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSuggestions = getSuggestions;
const setRoommatePreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const roommate = req.user;
        let { overview = undefined, details = undefined, leaseDuration = undefined, location = undefined, } = req.body;
        if (!((_a = location === null || location === void 0 ? void 0 : location.address) === null || _a === void 0 ? void 0 : _a.street) || !((_b = location === null || location === void 0 ? void 0 : location.address) === null || _b === void 0 ? void 0 : _b.city)) {
            location = undefined;
        }
        if (leaseDuration === null || leaseDuration === void 0 ? void 0 : leaseDuration.moveInDateStart) {
            leaseDuration.moveInDateStart = new Date(leaseDuration.moveInDateStart);
        }
        const updatedRoommate = yield roommateModel_1.default.findByIdAndUpdate(roommate._id, { preferences: { overview, details, location, leaseDuration } }, { new: true, runValidators: true });
        if (!updatedRoommate) {
            return res.status(404).json({ message: 'Roommate not found' });
        }
        res.status(200).json({
            message: 'Roommate preferences updated successfully',
            roommate: updatedRoommate,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating roommate preferences' });
    }
});
exports.setRoommatePreferences = setRoommatePreferences;
const roommateActions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { targetId } = req.params;
        const { action } = req.query;
        const roommate = req.user;
        if (!roommate.likes || !roommate.dislikes) {
            return res.status(400).json({ message: 'Incomplete user data' });
        }
        const apartment = yield apartmentModel_1.default.findById(targetId);
        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        switch (action) {
            case 'like':
                if (!roommate.likes.includes(apartment._id)) {
                    roommate.likes.push(apartment._id);
                    roommate.dislikes = roommate.dislikes.filter((id) => !id.equals(apartment._id));
                }
                break;
            case 'dislike':
                if (!roommate.dislikes.includes(apartment._id)) {
                    roommate.dislikes.push(apartment._id);
                    roommate.likes = roommate.likes.filter((id) => !id.equals(apartment._id));
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
        yield roommate.save();
        res.json({ message: 'Action successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.roommateActions = roommateActions;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { questionnaire } = _a, otherFields = __rest(_a, ["questionnaire"]);
        let updatedUser = req.user;
        if (!updatedUser || !updatedUser._id) {
            return res.status(404).json({ message: "User not found" });
        }
        if (questionnaire) {
            const questionnaireId = questionnaire._id;
            // Update the questionnaire document
            const updatedQuestionnaire = yield questionModel_1.default.findByIdAndUpdate(questionnaireId, questionnaire, { new: true, runValidators: true });
            if (!updatedQuestionnaire) {
                return res.status(404).json({ message: "Questionnaire not found" });
            }
            // Update the user with the updated questionnaire and other fields
            updatedUser = yield roommateModel_1.default.findByIdAndUpdate(updatedUser._id, Object.assign({ questionnaire: updatedQuestionnaire._id }, otherFields), { new: true, runValidators: true }).populate("questionnaire");
        }
        else {
            // Update the user without modifying the questionnaire
            updatedUser = yield roommateModel_1.default.findByIdAndUpdate(updatedUser._id, otherFields, { new: true, runValidators: true }).populate("questionnaire");
        }
        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update" });
        }
        res.json(updatedUser);
    }
    catch (err) {
        console.error("Error updating user:", err);
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ message: "Validation error", errors: err.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUser = updateUser;
