const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    smokingFrequency: { type: Number, min: 1, max: 5 },
    cleanlinessLevel: { type: Number, min: 1, max: 5 },
    cleanlinessInCommonAreas: { type: Number, min: 1, max: 5 },
    personalHygiene: { type: Number, min: 1, max: 5 },
    numberOfPets: { type: Number, min: 1, max: 5 },
    petBehavior: { type: Number, min: 1, max: 5 },
    alcoholConsumption: { type: Number, min: 1, max: 5 },
    socialBehavior: { type: Number, min: 1, max: 5 },
    frequencyOfGuests: { type: Number, min: 1, max: 5 },
    frequencyOfSocialGatherings: { type: Number, min: 1, max: 5 },
    importanceOfPrivacy: { type: Number, min: 1, max: 5 },
    importanceOfPersonalSpaceInSharedAreas: { type: Number, min: 1, max: 5 },
    importanceOfPersonalSpaceInBedroom: { type: Number, min: 1, max: 5 },
    respectForSharedAreas: { type: Number, min: 1, max: 5 },
    dietaryPreferences: { type: Number, min: 1, max: 5 },
    dietaryRestrictions: { type: Number, min: 1, max: 5 },
    fitnessAndExerciseLevel: { type: Number, min: 1, max: 5 },
    workOrStudyHabits: { type: Number, min: 1, max: 5 },
    importanceOfQuietTimeForWorkOrStudy: { type: Number, min: 1, max: 5 },
    politicalViews: { type: Number, min: 1, max: 5 },
    respectForDiversity: { type: Number, min: 1, max: 5 },
    environmentalAwareness: { type: Number, min: 1, max: 5 },
    importanceOfEnergyConservation: { type: Number, min: 1, max: 5 },
    activityLevelOfHobbies: { type: Number, min: 1, max: 5 },
    importanceOfQuietEnvironment: { type: Number, min: 1, max: 5 },
    musicPreferencesAndVolumeLevels: { type: Number, min: 1, max: 5 },
    sleepingPatterns: { type: Number, min: 1, max: 5 },
    importanceOfReligiousPractices: { type: Number, min: 1, max: 5 },
    willingnessToShareHouseholdChores: { type: Number, min: 1, max: 5 },
    importanceOfPersonalTimeForHobbies: { type: Number, min: 1, max: 5 },
  });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;


