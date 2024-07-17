const math = require('mathjs');

function calculateCompatibilityScore(userBio, userPreferences, candidateBio) {
  const characteristics = [
    'smokingFrequency',
    'cleanlinessLevel',
    'cleanlinessInCommonAreas',
    'personalHygiene',
    'numberOfPets',
    'petBehavior',
    'alcoholConsumption',
    'socialBehavior',
    'frequencyOfGuests',
    'frequencyOfSocialGatherings',
    'importanceOfPrivacy',
    'importanceOfPersonalSpaceInSharedAreas',
    'importanceOfPersonalSpaceInBedroom',
    'respectForSharedAreas',
    'dietaryPreferences',
    'dietaryRestrictions',
    'fitnessAndExerciseLevel',
    'workOrStudyHabits',
    'importanceOfQuietTimeForWorkOrStudy',
    'politicalViews',
    'respectForDiversity',
    'environmentalAwareness',
    'importanceOfEnergyConservation',
    'activityLevelOfHobbies',
    'importanceOfQuietEnvironment',
    'musicPreferencesAndVolumeLevels',
    'sleepingPatterns',
    'importanceOfReligiousPractices',
    'willingnessToShareHouseholdChores',
    'importanceOfPersonalTimeForHobbies'
  ];
    let compatibilityScore = 0;
    let totalCharacteristics = characteristics.length;
  
    for (const characteristic of characteristics) {
      const userValue = userBio[characteristic];
      const candidateValue = candidateBio[characteristic];
      const weight = Math.pow(userPreferences[characteristic], 2);
  
      const difference = Math.abs(userValue - candidateValue);
      const weightedDifference = difference * weight;
      const maxDifference = 4 * weight;
  
      const characteristicScore = 1 - (weightedDifference / maxDifference);
      compatibilityScore += characteristicScore;
    }
  
    const overallCompatibilityScore = compatibilityScore / totalCharacteristics;
    return overallCompatibilityScore;
  }

  module.exports = calculateCompatibilityScore;

// Example usage
const userBio = {
    smokingFrequency: 1,
    cleanlinessLevel: 4,
    cleanlinessInCommonAreas: 3,
    personalHygiene: 5,
    numberOfPets: 1,
    petBehavior: 2,
    alcoholConsumption: 3,
    socialBehavior: 4,
    frequencyOfGuests: 2,
    frequencyOfSocialGatherings: 1,
    importanceOfPrivacy: 5,
    importanceOfPersonalSpaceInSharedAreas: 4,
    importanceOfPersonalSpaceInBedroom: 5,
    respectForSharedAreas: 4,
    dietaryPreferences: 2,
    dietaryRestrictions: 1,
    fitnessAndExerciseLevel: 3,
    workOrStudyHabits: 4,
    importanceOfQuietTimeForWorkOrStudy: 5,
    politicalViews: 3,
    respectForDiversity: 5,
    environmentalAwareness: 4,
    importanceOfEnergyConservation: 3,
    activityLevelOfHobbies: 2,
    importanceOfQuietEnvironment: 4,
    musicPreferencesAndVolumeLevels: 3,
    sleepingPatterns: 5,
    importanceOfReligiousPractices: 1,
    willingnessToShareHouseholdChores: 4,
    importanceOfPersonalTimeForHobbies: 3
  };

  
  const userPreferences = {
    smokingFrequency: 5,
    cleanlinessLevel: 4,
    cleanlinessInCommonAreas: 5,
    personalHygiene: 4,
    numberOfPets: 2,
    petBehavior: 3,
    alcoholConsumption: 4,
    socialBehavior: 3,
    frequencyOfGuests: 2,
    frequencyOfSocialGatherings: 1,
    importanceOfPrivacy: 5,
    importanceOfPersonalSpaceInSharedAreas: 4,
    importanceOfPersonalSpaceInBedroom: 5,
    respectForSharedAreas: 4,
    dietaryPreferences: 3,
    dietaryRestrictions: 2,
    fitnessAndExerciseLevel: 3,
    workOrStudyHabits: 4,
    importanceOfQuietTimeForWorkOrStudy: 5,
    politicalViews: 2,
    respectForDiversity: 4,
    environmentalAwareness: 3,
    importanceOfEnergyConservation: 2,
    activityLevelOfHobbies: 1,
    importanceOfQuietEnvironment: 4,
    musicPreferencesAndVolumeLevels: 3,
    sleepingPatterns: 5,
    importanceOfReligiousPractices: 1,
    willingnessToShareHouseholdChores: 4,
    importanceOfPersonalTimeForHobbies: 3
  };
  
  const candidateBio = {
    smokingFrequency: 2,
    cleanlinessLevel: 3,
    cleanlinessInCommonAreas: 4,
    personalHygiene: 5,
    numberOfPets: 0,
    petBehavior: 1,
    alcoholConsumption: 2,
    socialBehavior: 4,
    frequencyOfGuests: 3,
    frequencyOfSocialGatherings: 2,
    importanceOfPrivacy: 4,
    importanceOfPersonalSpaceInSharedAreas: 3,
    importanceOfPersonalSpaceInBedroom: 5,
    respectForSharedAreas: 4,
    dietaryPreferences: 2,
    dietaryRestrictions: 1,
    fitnessAndExerciseLevel: 4,
    workOrStudyHabits: 3,
    importanceOfQuietTimeForWorkOrStudy: 4,
    politicalViews: 3,
    respectForDiversity: 5,
    environmentalAwareness: 4,
    importanceOfEnergyConservation: 3,
    activityLevelOfHobbies: 2,
    importanceOfQuietEnvironment: 4,
    musicPreferencesAndVolumeLevels: 2,
    sleepingPatterns: 4,
    importanceOfReligiousPractices: 1,
    willingnessToShareHouseholdChores: 5,
    importanceOfPersonalTimeForHobbies: 3
  };

// const score = calculateCompatibilityScore(userBio, userPreferences, candidateBio) * 100 ;
// console.log('Compatibility Score:', score);