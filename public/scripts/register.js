const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const nextStep1Btn = document.getElementById('next-step-1');
const prevStep2Btn = document.getElementById('prev-step-2');
const nextStep2Btn = document.getElementById('next-step-2');
const prevStep3Btn = document.getElementById('prev-step-3');
const submitFormBtn = document.getElementById('submit-form');

nextStep1Btn.addEventListener('click', () => {
  step1.style.display = 'none';
  step2.style.display = 'block';
});

prevStep2Btn.addEventListener('click', () => {
  
  step1.style.display = 'block';
  step2.style.display = 'none';
});

nextStep2Btn.addEventListener('click', () => {
  step2.style.display = 'none';
  step3.style.display = 'block';
});

prevStep3Btn.addEventListener('click', () => {
  step2.style.display = 'block';
  step3.style.display = 'none';
});

submitFormBtn.addEventListener('click', () => {
  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    fullName: document.getElementById('fullName').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    bio: {
      smokingFrequency: document.getElementById('bio-smokingFrequency').value,
      cleanlinessLevel: document.getElementById('bio-cleanlinessLevel').value,
      cleanlinessInCommonAreas: document.getElementById('bio-cleanlinessInCommonAreas').value,
      personalHygiene: document.getElementById('bio-personalHygiene').value,
      numberOfPets: document.getElementById('bio-numberOfPets').value,
      petBehavior: document.getElementById('bio-petBehavior').value,
      alcoholConsumption: document.getElementById('bio-alcoholConsumption').value,
      socialBehavior: document.getElementById('bio-socialBehavior').value,
      frequencyOfGuests: document.getElementById('bio-frequencyOfGuests').value,
      frequencyOfSocialGatherings: document.getElementById('bio-frequencyOfSocialGatherings').value,
      importanceOfPrivacy: document.getElementById('bio-importanceOfPrivacy').value,
      importanceOfPersonalSpaceInSharedAreas: document.getElementById('bio-importanceOfPersonalSpaceInSharedAreas').value,
      importanceOfPersonalSpaceInBedroom: document.getElementById('bio-importanceOfPersonalSpaceInBedroom').value,
      respectForSharedAreas: document.getElementById('bio-respectForSharedAreas').value,
      dietaryPreferences: document.getElementById('bio-dietaryPreferences').value,
      dietaryRestrictions: document.getElementById('bio-dietaryRestrictions').value,
      fitnessAndExerciseLevel: document.getElementById('bio-fitnessAndExerciseLevel').value,
      workOrStudyHabits: document.getElementById('bio-workOrStudyHabits').value,
      importanceOfQuietTimeForWorkOrStudy: document.getElementById('bio-importanceOfQuietTimeForWorkOrStudy').value,
      politicalViews: document.getElementById('bio-politicalViews').value,
      respectForDiversity: document.getElementById('bio-respectForDiversity').value,
      environmentalAwareness: document.getElementById('bio-environmentalAwareness').value,
      importanceOfEnergyConservation: document.getElementById('bio-importanceOfEnergyConservation').value,
      activityLevelOfHobbies: document.getElementById('bio-activityLevelOfHobbies').value,
      importanceOfQuietEnvironment: document.getElementById('bio-importanceOfQuietEnvironment').value,
      musicPreferencesAndVolumeLevels: document.getElementById('bio-musicPreferencesAndVolumeLevels').value,
      sleepingPatterns: document.getElementById('bio-sleepingPatterns').value,
      importanceOfReligiousPractices: document.getElementById('bio-importanceOfReligiousPractices').value,
      willingnessToShareHouseholdChores: document.getElementById('bio-willingnessToShareHouseholdChores').value,
      importanceOfPersonalTimeForHobbies: document.getElementById('bio-importanceOfPersonalTimeForHobbies').value
    },
    preferences: {
      importance: {
        importanceOfPrivacy: document.getElementById('preferences-importanceOfPrivacy').value,
        importanceOfPersonalSpaceInSharedAreas: document.getElementById('preferences-importanceOfPersonalSpaceInSharedAreas').value,
        importanceOfPersonalSpaceInBedroom: document.getElementById('preferences-importanceOfPersonalSpaceInBedroom').value,
        respectForSharedAreas: document.getElementById('preferences-respectForSharedAreas').value,
        dietaryPreferences: document.getElementById('preferences-dietaryPreferences').value,
        dietaryRestrictions: document.getElementById('preferences-dietaryRestrictions').value,
        fitnessAndExerciseLevel: document.getElementById('preferences-fitnessAndExerciseLevel').value,
        workOrStudyHabits: document.getElementById('preferences-workOrStudyHabits').value,
        importanceOfQuietTimeForWorkOrStudy: document.getElementById('preferences-importanceOfQuietTimeForWorkOrStudy').value,
        politicalViews: document.getElementById('preferences-politicalViews').value,
        respectForDiversity: document.getElementById('preferences-respectForDiversity').value,
        environmentalAwareness: document.getElementById('preferences-environmentalAwareness').value,
        importanceOfEnergyConservation: document.getElementById('preferences-importanceOfEnergyConservation').value,
        activityLevelOfHobbies: document.getElementById('preferences-activityLevelOfHobbies').value,
        importanceOfQuietEnvironment: document.getElementById('preferences-importanceOfQuietEnvironment').value,
        musicPreferencesAndVolumeLevels: document.getElementById('preferences-musicPreferencesAndVolumeLevels').value,
        sleepingPatterns: document.getElementById('preferences-sleepingPatterns').value,
        importanceOfReligiousPractices: document.getElementById('preferences-importanceOfReligiousPractices').value,
        willingnessToShareHouseholdChores: document.getElementById('preferences-willingnessToShareHouseholdChores').value,
        importanceOfPersonalTimeForHobbies: document.getElementById('preferences-importanceOfPersonalTimeForHobbies').value
      },
      budget: document.getElementById('budget').value,
      address: document.getElementById('address').value
    }
  };

  // Send formData to server using fetch or XMLHttpRequest
  fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Registration successful:', data);
      // Handle successful registration response
    })
    .catch((error) => {
      console.error('Registration error:', error);
      // Handle registration error
    });
});
