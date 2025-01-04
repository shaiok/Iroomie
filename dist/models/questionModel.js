"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 3. Define the Answer Schema
const answerSchema = new mongoose_1.Schema({
    value: { type: Number, min: 1, max: 5 },
    importance: { type: Number, min: 1, max: 5 },
});
// 4. Define the Question Schema
const questionSchema = new mongoose_1.Schema({
    smokingFrequency: answerSchema,
    cleanlinessLevel: answerSchema,
    cleanlinessInCommonAreas: answerSchema,
    personalHygiene: answerSchema,
    numberOfPets: answerSchema,
    petBehavior: answerSchema,
    alcoholConsumption: answerSchema,
    socialBehavior: answerSchema,
    frequencyOfGuests: answerSchema,
    frequencyOfSocialGatherings: answerSchema,
    importanceOfPrivacy: answerSchema,
    importanceOfPersonalSpaceInSharedAreas: answerSchema,
    importanceOfPersonalSpaceInBedroom: answerSchema,
    respectForSharedAreas: answerSchema,
    dietaryPreferences: answerSchema,
    dietaryRestrictions: answerSchema,
    fitnessAndExerciseLevel: answerSchema,
    workOrStudyHabits: answerSchema,
    importanceOfQuietTimeForWorkOrStudy: answerSchema,
    politicalViews: answerSchema,
    respectForDiversity: answerSchema,
    environmentalAwareness: answerSchema,
    importanceOfEnergyConservation: answerSchema,
    activityLevelOfHobbies: answerSchema,
    importanceOfQuietEnvironment: answerSchema,
    musicPreferencesAndVolumeLevels: answerSchema,
    sleepingPatterns: answerSchema,
    importanceOfReligiousPractices: answerSchema,
    willingnessToShareHouseholdChores: answerSchema,
    importanceOfPersonalTimeForHobbies: answerSchema,
});
// 5. Create and export the Question model
const Question = (0, mongoose_1.model)("Question", questionSchema);
exports.default = Question;
