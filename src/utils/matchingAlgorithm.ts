import { abs, pow } from "mathjs";
import { IQuestion } from "../models/questionModel";

function calculateCompatibilityScore(userQuestions: IQuestion, candidateQuestions: IQuestion): number {
  const characteristics: (keyof IQuestion)[] = [
    "smokingFrequency",
    "cleanlinessLevel",
    "cleanlinessInCommonAreas",
    "personalHygiene",
    "numberOfPets",
    "petBehavior",
    "alcoholConsumption",
    "socialBehavior",
    "frequencyOfGuests",
    "frequencyOfSocialGatherings",
    "importanceOfPrivacy",
    "importanceOfPersonalSpaceInSharedAreas",
    "importanceOfPersonalSpaceInBedroom",
    "respectForSharedAreas",
    "dietaryPreferences",
    "dietaryRestrictions",
    "fitnessAndExerciseLevel",
    "workOrStudyHabits",
    "importanceOfQuietTimeForWorkOrStudy",
    "politicalViews",
    "respectForDiversity",
    "environmentalAwareness",
    "importanceOfEnergyConservation",
    "activityLevelOfHobbies",
    "importanceOfQuietEnvironment",
    "musicPreferencesAndVolumeLevels",
    "sleepingPatterns",
    "importanceOfReligiousPractices",
    "willingnessToShareHouseholdChores",
    "importanceOfPersonalTimeForHobbies",
  ];

  let totalScore = 0;
  let totalWeight = 0;

  for (const characteristic of characteristics) {
    const userAnswer = userQuestions[characteristic];
    const candidateAnswer = candidateQuestions[characteristic];

    if (!userAnswer || !candidateAnswer) continue;

    const userValue = userAnswer.value;
    const candidateValue = candidateAnswer.value;
    const importanceWeight = pow(userAnswer.importance, 2) as number;

    const difference = abs(userValue - candidateValue);
    const weightedDifference = difference * importanceWeight;
    const maxDifference = 4 * importanceWeight;

    // Calculate score for this characteristic
    const characteristicScore = 1 - weightedDifference / maxDifference;
    totalScore += characteristicScore * importanceWeight;
    totalWeight += importanceWeight;
  }

  // Normalize score and round to percentage
  const overallCompatibilityScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  return overallCompatibilityScore;
}

export default calculateCompatibilityScore;
