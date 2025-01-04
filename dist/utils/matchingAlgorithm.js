"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
function calculateCompatibilityScore(userQuestions, candidateQuestions) {
    const characteristics = [
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
        if (!userAnswer || !candidateAnswer)
            continue;
        const userValue = userAnswer.value;
        const candidateValue = candidateAnswer.value;
        const importanceWeight = (0, mathjs_1.pow)(userAnswer.importance, 2);
        const difference = (0, mathjs_1.abs)(userValue - candidateValue);
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
exports.default = calculateCompatibilityScore;
