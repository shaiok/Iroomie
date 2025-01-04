import { Schema, model, Document } from "mongoose";

// 1. Define the Answer interface
interface IAnswer {
  value: number; // Value between 1 and 5
  importance: number; // Importance between 1 and 5
}

// 2. Define the Question document interface
export interface IQuestion extends Document {
  smokingFrequency?: IAnswer;
  cleanlinessLevel?: IAnswer;
  cleanlinessInCommonAreas?: IAnswer;
  personalHygiene?: IAnswer;
  numberOfPets?: IAnswer;
  petBehavior?: IAnswer;
  alcoholConsumption?: IAnswer;
  socialBehavior?: IAnswer;
  frequencyOfGuests?: IAnswer;
  frequencyOfSocialGatherings?: IAnswer;
  importanceOfPrivacy?: IAnswer;
  importanceOfPersonalSpaceInSharedAreas?: IAnswer;
  importanceOfPersonalSpaceInBedroom?: IAnswer;
  respectForSharedAreas?: IAnswer;
  dietaryPreferences?: IAnswer;
  dietaryRestrictions?: IAnswer;
  fitnessAndExerciseLevel?: IAnswer;
  workOrStudyHabits?: IAnswer;
  importanceOfQuietTimeForWorkOrStudy?: IAnswer;
  politicalViews?: IAnswer;
  respectForDiversity?: IAnswer;
  environmentalAwareness?: IAnswer;
  importanceOfEnergyConservation?: IAnswer;
  activityLevelOfHobbies?: IAnswer;
  importanceOfQuietEnvironment?: IAnswer;
  musicPreferencesAndVolumeLevels?: IAnswer;
  sleepingPatterns?: IAnswer;
  importanceOfReligiousPractices?: IAnswer;
  willingnessToShareHouseholdChores?: IAnswer;
  importanceOfPersonalTimeForHobbies?: IAnswer;
}

// 3. Define the Answer Schema
const answerSchema = new Schema<IAnswer>({
  value: { type: Number, min: 1, max: 5 },
  importance: { type: Number, min: 1, max: 5 },
});

// 4. Define the Question Schema
const questionSchema = new Schema<IQuestion>({
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
const Question = model<IQuestion>("Question", questionSchema);

export default Question;
