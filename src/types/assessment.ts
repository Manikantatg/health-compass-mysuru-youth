
export interface SocioDemographic {
  schoolName: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  class: string;
  section: string;
  height: number; // in cm
  weight: number; // in kg
  address: string;
  hostelResident: boolean;
  fatherName: string;
  motherName: string;
  fatherContact: string;
  motherContact: string;
  brothers: number;
  sisters: number;
  birthOrder: number; // 0 = Only Child, 1 = First, 2+ = Middle, 999 = Last
  familyType: 'nuclear' | 'joint' | 'three-generation';
  // Family history questions
  familyObesity: 'yes' | 'no' | 'cannot-tell';
  familyObesityRelation?: 'father' | 'mother' | 'both-parents';
  familyDiabetes: 'yes' | 'no' | 'dont-know';
  familyDiabetesRelation?: 'father' | 'mother' | 'both-parents';
  familyHypertension: 'yes' | 'no' | 'dont-know';
  familyHypertensionRelation?: 'father' | 'mother' | 'both-parents';
  familyThyroid: 'yes' | 'no' | 'dont-know';
  familyThyroidRelation?: 'father' | 'mother' | 'both-parents';
  // Legacy fields for backward compatibility
  hasSiblings: 'yes' | 'no';
  familyObesityHistory: boolean;
  diabetesHistory: boolean;
  bpHistory: boolean;
  thyroidHistory: boolean;
}

export interface EatingHabits {
  cereals: number; // 0-4 scale
  pulses: number;
  vegetables: number;
  fruits: number;
  milkProducts: number;
  nonVeg: number;
  // Updated eating habits
  snacks: number; // Replaces junkFood
  beverages: number; // Replaces softDrinks and energyDrinks
  sweets: number; // Keep existing
  // Legacy fields for backward compatibility - all required for type safety
  junkFood: number;
  softDrinks: number;
  energyDrinks: number;
}

export interface PhysicalActivity {
  ptFrequency: number; // 0-7 days
  ptDuration: number; // minutes
  participation: boolean;
  // New school activities
  scouts?: boolean;
  ncc?: boolean;
  otherActivities?: boolean;
  otherActivitiesDetail?: string;
  noActivities?: boolean; // New "None" option
  // Updated activities with days and minutes structure
  yoga: { days: number; minutes: number } | number;
  exercise: { days: number; minutes: number } | number;
  indoorGames: { days: number; minutes: number } | number;
  outdoorGames: { days: number; minutes: number } | number;
  playAfterSchool: { days: number; minutes: number } | number;
  cycling: { days: number; minutes: number } | number;
  walking: { days: number; minutes: number } | number;
  // Legacy fields for backward compatibility
  dance: number;
  swimming: number;
}

export interface SedentaryBehavior {
  // Updated to use 0-3 scale (Never, Occasionally, Weekly, Daily)
  tvTime: number;
  mobileTime: number;
  schoolReading: number;
  nonSchoolReading: number; // Now includes "(hobbies)" in label
  indoorGamesTime: number;
  outdoorGamesTime: number;
  tuitionTime: number;
  // Legacy fields for backward compatibility
  homeworkTime: number;
  readingTime: number;
  gamingTime: number;
  musicTime: number;
}

export interface MentalHealth {
  bodyPerception: number; // 1-5 scale
  bullyingExperience: boolean;
  weightGoal: 'lose' | 'gain' | 'maintain';
  bodyImageSelection: number; // 1-9 scale
  // New body image satisfaction fields
  currentBodyImageSatisfaction?: number; // 1-5 scale (Very dissatisfied to Very satisfied)
  desiredBodyImageSatisfaction?: number; // 1-5 scale (Very dissatisfied to Very satisfied)
  // New mental health questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
  difficultyWalking: number;
  difficultyRunning: number;
  difficultySports: number;
  difficultyAttention: number;
  forgetThings: number;
  troubleKeepingUp: number;
  feelLonely: number;
  wantEatLess: number;
  // Legacy fields for backward compatibility
  mobilityIssues: number;
}

export interface SleepQuality {
  // New sleep time fields
  bedtime?: string; // HH:MM format
  wakeupTime?: string; // HH:MM format
  sleepDuration?: number; // auto-computed in minutes
  // Updated sleep questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
  difficultyFallingAsleep: number;
  wakeUpDuringSleep: number;
  wakeUpFromNoise: number;
  difficultyGettingBackToSleep: number;
  sleepinessInClasses: number;
  sleepHeadache: number;
  sleepIrritation: number;
  sleepLossOfInterest: number;
  sleepForgetfulness: number;
  // Legacy fields for backward compatibility
  sleepIssues: string[];
}

export interface HealthScores {
  eatingHabitsScore: number;
  physicalActivityScore: number;
  sedentaryScore: number;
  mentalHealthScore: number;
  sleepScore: number;
  // New AI-generated score
  aiScore?: number;
}

export interface AssessmentData {
  id?: string;
  userId: string;
  socioDemographic: SocioDemographic;
  eatingHabits: EatingHabits;
  physicalActivity: PhysicalActivity;
  sedentaryBehavior: SedentaryBehavior;
  mentalHealth: MentalHealth;
  sleepQuality: SleepQuality;
  bmi: number;
  completedAt: Date;
  scores?: HealthScores;
  aiPrediction: {
    riskLevel: 'Low' | 'Medium' | 'High';
    riskPercentage: number;
    recommendations: string[];
    explanation: string;
    // New AI analysis fields
    strengths?: string[];
    topRecommendations?: string[];
  };
}
