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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testApartment = exports.testRoommate = exports.bulkRegistration = exports.logout = exports.completeApartmentRegistration = exports.completeRoommateRegistration = exports.getCurrentUser = exports.googleAuthCallback = void 0;
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the import path as needed
const roommateModel_1 = __importDefault(require("../models/roommateModel")); // Adjust the import path as needed
const apartmentModel_1 = __importDefault(require("../models/apartmentModel")); // Adjust the import path as needed
const questionModel_1 = __importDefault(require("../models/questionModel")); // Adjust the import path as needed
const date_fns_1 = require("date-fns");
const uploadToCloudinary_1 = __importDefault(require("../utils/uploadToCloudinary")); // Adjust the import path as needed
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userInfo = req.user;
    const { id, displayName, emails, photos } = userInfo;
    if (!req.session) {
        console.error('Session is undefined');
        res.redirect(`${process.env.FRONTEND_URL}/auth`);
        return;
    }
    try {
        const user = yield userModel_1.default.findOne({ email: emails[0].value });
        if (!user) {
            req.session.userRegitration = {
                fullName: displayName || emails[0].value.split("@")[0],
                email: emails[0].value,
                googleId: id,
                picture: (_a = photos[0]) === null || _a === void 0 ? void 0 : _a.value,
            };
            res.redirect(`${process.env.FRONTEND_URL}/complete-signup`);
        }
        else {
            req.session.user = user;
            req.session.profile = (_b = user.profile) === null || _b === void 0 ? void 0 : _b.toString();
            res.redirect(`${process.env.FRONTEND_URL}/`);
        }
    }
    catch (error) {
        console.error(error);
        res.redirect(`${process.env.FRONTEND_URL}/auth`);
    }
});
exports.googleAuthCallback = googleAuthCallback;
const getCurrentUser = (req, res) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        const userType = req.session.user.userType;
        if (userType === 'roommate') {
            roommateModel_1.default.findById(req.session.profile)
                .populate('questionnaire')
                .then((roommate) => {
                if (!req.session) {
                    console.error('Session is undefined');
                    res.redirect(`${process.env.FRONTEND_URL}/auth`);
                    return;
                }
                res.json({ user: req.session.user, profile: roommate });
            })
                .catch((err) => {
                console.error(err);
                res.status(400).json({ message: err.message });
            });
        }
        else if (userType === 'apartment') {
            apartmentModel_1.default.findById(req.session.profile)
                .populate('questionnaire')
                .then((apartment) => {
                if (!req.session) {
                    console.error('Session is undefined');
                    res.redirect(`${process.env.FRONTEND_URL}/auth`);
                    return;
                }
                res.json({ user: req.session.user, profile: apartment });
            })
                .catch((err) => {
                console.error(err);
                res.status(400).json({ message: err.message });
            });
        }
    }
    else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};
exports.getCurrentUser = getCurrentUser;
const completeRoommateRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session) {
            return console.error('Session is undefined');
        }
        const { questionnaireAnswers, personalInfo, interests, social } = req.body;
        const { fullName, email, googleId, picture } = req.session.userRegitration;
        const user = new userModel_1.default({
            fullName,
            email,
            googleId,
            userType: 'roommate',
            picture,
        });
        yield user.save();
        const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
        const parsedPersonalInfo = JSON.parse(personalInfo);
        const parsedInterests = JSON.parse(interests);
        const parsedSocial = JSON.parse(social);
        let files = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            }
            else {
                files = Object.values(req.files).flat();
            }
        }
        const imageUrl = files.length > 0 ? yield (0, uploadToCloudinary_1.default)(files) : [];
        const savedQuestionnaire = yield new questionModel_1.default(parsedQuestionnaire).save();
        const newRoommate = yield new roommateModel_1.default({
            user: user._id,
            questionnaire: savedQuestionnaire._id,
            personalInfo: Object.assign(Object.assign({}, parsedPersonalInfo), { name: fullName }),
            interests: parsedInterests,
            social: Object.assign(Object.assign({}, parsedSocial), { profileImage: imageUrl ? imageUrl[0] : undefined }),
        }).save();
        user.profile = newRoommate._id;
        if (imageUrl) {
            user.picture = imageUrl[0];
        }
        yield user.save();
        res.status(201).json({
            message: 'Roommate registration completed successfully',
            userId: user._id,
            roommateId: newRoommate._id,
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.completeRoommateRegistration = completeRoommateRegistration;
const completeApartmentRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session) {
            return console.error('Session is undefined');
        }
        const { questionnaireAnswers, info, amenities, details } = req.body;
        console.log(req.session.userRegitration);
        const { fullName = 'user', email, googleId, picture, } = req.session.userRegitration;
        const user = new userModel_1.default({
            fullName,
            email,
            googleId,
            userType: 'apartment',
            picture,
        });
        yield user.save();
        const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
        const parsedInfo = JSON.parse(info);
        const parsedAmenities = JSON.parse(amenities);
        const parsedDetails = JSON.parse(details);
        let files = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            }
            else {
                files = Object.values(req.files).flat();
            }
        }
        const imageUrls = files.length > 0 ? yield (0, uploadToCloudinary_1.default)(files) : [];
        const savedQuestionnaire = yield new questionModel_1.default(parsedQuestionnaire).save();
        const newApartment = yield new apartmentModel_1.default({
            user: user._id,
            questionnaire: savedQuestionnaire._id,
            info: Object.assign(Object.assign({}, parsedInfo), { leaseTerms: Object.assign(Object.assign({}, parsedInfo.leaseTerms), { availableFrom: (0, date_fns_1.format)(new Date(parsedInfo.leaseTerms.availableFrom), 'dd MMMM, yyyy') }), roommates: [user.fullName], images: imageUrls }),
            amenities: parsedAmenities,
            details: parsedDetails,
        }).save();
        user.profile = newApartment._id;
        yield user.save();
        res.status(201).json({
            message: 'Apartment registration completed successfully',
            userId: user._id,
            apartmentId: newApartment._id,
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.completeApartmentRegistration = completeApartmentRegistration;
const logout = (req, res) => {
    if (!req.session) {
        return console.error('Session is undefined');
    }
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};
exports.logout = logout;
const bulkRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrations, userType } = req.body;
        const results = [];
        for (const registration of registrations) {
            const { email, fullName, questionnaireAnswers, info, images } = registration;
            // Create user
            const user = new userModel_1.default({
                fullName,
                email,
                userType,
                picture: images && images.length > 0 ? images[0] : null,
            });
            yield user.save();
            // Create and save questionnaire
            const savedQuestionnaire = yield new questionModel_1.default(JSON.parse(questionnaireAnswers)).save();
            let profile;
            if (userType === 'roommate') {
                const { personalInfo, interests, social } = registration;
                profile = new roommateModel_1.default({
                    user: user._id,
                    questionnaire: savedQuestionnaire._id,
                    personalInfo: Object.assign(Object.assign({}, JSON.parse(personalInfo)), { name: fullName }),
                    interests: JSON.parse(interests),
                    social: Object.assign(Object.assign({}, JSON.parse(social)), { profileImage: images && images.length > 0 ? images[0] : null }),
                });
            }
            else if (userType === 'apartment') {
                const { amenities, details } = registration;
                const parsedInfo = JSON.parse(info);
                profile = new apartmentModel_1.default({
                    user: user._id,
                    questionnaire: savedQuestionnaire._id,
                    info: Object.assign(Object.assign({}, parsedInfo), { leaseTerms: Object.assign(Object.assign({}, parsedInfo.leaseTerms), { availableFrom: (0, date_fns_1.format)(new Date(parsedInfo.leaseTerms.availableFrom), 'dd MMMM, yyyy') }), roommates: [user.fullName], images: images || [] }),
                    amenities: JSON.parse(amenities),
                    details: JSON.parse(details),
                });
            }
            if (profile) {
                yield profile.save();
                user.profile = profile._id;
                yield user.save();
                results.push({
                    email: user.email,
                    userId: user._id,
                    profileId: profile._id,
                });
            }
        }
        res.status(201).json({
            message: `Bulk ${userType} registration completed successfully`,
            results,
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.bulkRegistration = bulkRegistration;
const testRoommate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session) {
            return console.error('Session is undefined');
        }
        const user = yield userModel_1.default.findById('66afab6144060cef69ec439a');
        const roommate = yield roommateModel_1.default.findById('66afab6244060cef69ec43bc').populate('questionnaire');
        if (!user || !roommate) {
            throw new Error('User or roommate profile not found');
        }
        req.session.user = user;
        req.session.profile = roommate.id;
        res.json({ user, profile: roommate });
    }
    catch (error) {
        console.error('Error in testRoommate:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.testRoommate = testRoommate;
const testApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session) {
            return console.error('Session is undefined');
        }
        const user = yield userModel_1.default.findById('66b7d609cbe50ceed466e729');
        const apartment = yield apartmentModel_1.default.findById('66b7d60bcbe50ceed466e74b').populate('questionnaire');
        if (!user || !apartment) {
            throw new Error('User or apartment profile not found');
        }
        req.session.user = user;
        req.session.profile = apartment.id;
        res.json({ user, profile: apartment });
    }
    catch (error) {
        console.error('Error in testApartment:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.testApartment = testApartment;
