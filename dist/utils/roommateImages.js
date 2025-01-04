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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const roommateModel_1 = __importDefault(require("../models/roommateModel")); // Adjust the import path as needed
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the import path as needed
const apartmentModel_1 = __importDefault(require("../models/apartmentModel")); // Adjust the import path as needed
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
});
const defaultImages = [
    "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1670884442192-7b58d513cd55?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1706885093487-7eda37b48a60?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1677368597077-009727e906db?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];
function getRandomDefaultImage() {
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}
function updateRoommateImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const roommates = yield roommateModel_1.default.find({
                $or: [
                    { 'social.profileImage': { $exists: false } },
                    { 'social.profileImage': null }
                ]
            });
            console.log(`Found ${roommates.length} roommates without profile images.`);
            for (const roommate of roommates) {
                const user = yield userModel_1.default.findById(roommate.user);
                roommate.social = roommate.social || {};
                if (user && user.picture) {
                    roommate.social.profileImage = user.picture;
                    console.log(`Updated profile image for roommate: ${roommate._id} with user's picture`);
                }
                else {
                    roommate.social.profileImage = getRandomDefaultImage();
                    console.log(`Assigned random default image to roommate: ${roommate._id}`);
                }
                yield roommate.save();
            }
            console.log('Finished updating roommate profile images.');
        }
        catch (error) {
            console.error('Error updating roommate profile images:', error);
        }
        finally {
            yield mongoose_1.default.connection.close();
            console.log('Database connection closed');
        }
    });
}
// updateRoommateImages().then(() => process.exit(0));
function removeApartmentPreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield apartmentModel_1.default.updateMany({}, // match all documents
            { $unset: { preferences: "" } } // remove the preferences field
            );
            console.log(`Updated ${result.modifiedCount} apartments.`);
            console.log(`${result.matchedCount} apartments were found in total.`);
            if (result.matchedCount > result.modifiedCount) {
                console.log(`${result.matchedCount - result.modifiedCount} apartments didn't have a preferences field.`);
            }
        }
        catch (error) {
            console.error('Error removing apartment preferences:', error);
        }
        finally {
            yield mongoose_1.default.connection.close();
            console.log('Database connection closed');
        }
    });
}
removeApartmentPreferences().then(() => process.exit(0));
