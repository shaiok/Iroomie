"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.checkUserType = exports.setAction = exports.setPreferences = exports.updateUser = exports.getactivity = exports.getSuggestions = exports.getmatches = void 0;
const roommateModel_1 = __importDefault(require("../models/roommateModel"));
const apartmentModel_1 = __importDefault(require("../models/apartmentModel"));
const roommateController = __importStar(require("./roommateController"));
const apartmentController = __importStar(require("./apartmentController"));
// Define Controller Map
const controllerMap = {
    roommate: {
        getMatches: roommateController.getMatches,
        getActivity: roommateController.getActivity,
        getSuggestions: roommateController.getSuggestions,
        updateUser: roommateController.updateUser,
        setPreferences: roommateController.setRoommatePreferences,
        setAction: roommateController.roommateActions,
    },
    apartment: {
        getMatches: apartmentController.getMatches,
        getActivity: apartmentController.getActivity,
        getSuggestions: apartmentController.getSuggestions,
        updateUser: apartmentController.updateApartment,
        setPreferences: apartmentController.setApartmentPreferences,
        setAction: apartmentController.apartmentActions,
    }
};
// Create Controller Method Dynamically
const createControllerMethod = (methodName) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const method = (_a = controllerMap[req.userType]) === null || _a === void 0 ? void 0 : _a[methodName]; // Non-null assertion on `userType`
            if (!method) {
                res.status(400).json({ message: `Action not supported for ${req.userType}` });
                return;
            }
            method(req, res); // Pass the request and response objects
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    });
};
// Export Controller Methods
exports.getmatches = createControllerMethod("getMatches");
exports.getSuggestions = createControllerMethod("getSuggestions");
exports.getactivity = createControllerMethod("getActivity");
exports.updateUser = createControllerMethod("updateUser");
exports.setPreferences = createControllerMethod("setPreferences");
exports.setAction = createControllerMethod("setAction");
// Middleware to Check User Type and Fetch User Object
const checkUserType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.profile)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userId = req.session.profile;
        // Try to find the user as a roommate
        let user = yield roommateModel_1.default.findById(userId).populate("questionnaire");
        if (user) {
            req.userType = "roommate";
            req.user = user;
        }
        else {
            // Try to find the user as an apartment
            user = yield apartmentModel_1.default.findById(userId).populate("questionnaire");
            if (user) {
                req.userType = "apartment";
                req.user = user;
            }
            else {
                res.status(400).json({ message: "Invalid user type" });
                return;
            }
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkUserType = checkUserType;
