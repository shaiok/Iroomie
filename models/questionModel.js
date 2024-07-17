const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answerIndex: { type: Number, min: 1, max: 5 },
  importance: { type: Number, min: 1, max: 5 },
});

const questionSchema = new mongoose.Schema({
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

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
