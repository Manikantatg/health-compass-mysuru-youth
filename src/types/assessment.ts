export interface SocioDemographic {
  schoolName: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other' | 'none';
  class: string;
  section: string;
  height?: number; // in cm
  weight?: number; // in kg
  address: string;
  hostelResident: boolean;
  fatherName: string;
  motherName: string;
  fatherContact: string;
  motherContact: string;
  brothers: number;
  sisters: number;
  birthOrder?: number; // 0 = Only Child, 1 = First, 2+ = Middle, 999 = Last
  familyType: 'nuclear' | 'joint' | 'three-generation' | 'none';
  // Family history questions
  familyObesity: 'yes' | 'no' | 'cannot-tell' | 'none';
  familyObesityRelation?: 'father' | 'mother' | 'both-parents';
  familyDiabetes: 'yes' | 'no' | 'dont-know' | 'none';
  familyDiabetesRelation?: 'father' | 'mother' | 'both-parents';
  familyHypertension: 'yes' | 'no' | 'dont-know' | 'none';
  familyHypertensionRelation?: 'father' | 'mother' | 'both-parents';
  familyThyroid: 'yes' | 'no' | 'dont-know' | 'none';
  familyThyroidRelation?: 'father' | 'mother' | 'both-parents';
  // Legacy fields for backward compatibility
  hasSiblings: 'yes' | 'no' | 'none';
  familyObesityHistory: boolean;
  diabetesHistory: boolean;
  bpHistory: boolean;
  thyroidHistory: boolean;
}

export interface EatingHabits {
  cereals?: number; // 0-4 scale
  pulses?: number;
  vegetables?: number;
  fruits?: number;
  milkProducts?: number;
  // New consolidated non-veg field
  nonVegConsumption?: number; // 0-4 scale: Never, Rarely, Sometimes, Very often, Almost always
  // Processed foods
  snacks?: number;
  beverages?: number;
  sweets?: number;
  // Legacy fields for backward compatibility
  chicken?: number;
  fish?: number;
  eggs?: number;
  seafood?: number;
  leanMeats?: number;
  nonVeg?: number;
  junkFood?: number;
  softDrinks?: number;
  energyDrinks?: number;
}

export interface PhysicalActivity {
  ptFrequency?: number; // 0-7 days
  ptDuration?: number; // minutes
  ptActivityType?: string; // New field: 'indoor' | 'outdoor'
  participation: boolean;
  // New school activities
  scouts?: boolean;
  ncc?: boolean;
  otherActivities?: boolean;
  otherActivitiesDetail?: string;
  noActivities?: boolean; // New "None" option
  // Updated activities with days and minutes structure
  yoga: { days?: number; minutes: string } | number;
  exercise: { days?: number; minutes: string } | number;
  indoorGames: { days?: number; minutes: string } | number;
  outdoorGames: { days?: number; minutes: string } | number;
  playAfterSchool: { days?: number; minutes: string } | number;
  cycling: { days?: number; minutes: string } | number;
  walking: { days?: number; minutes: string } | number;
  // Legacy fields for backward compatibility
  dance?: number;
  swimming?: number;
}

export interface SedentaryBehavior {
  // Updated to use 0-4 scale (Never, < 1 Hr/day, 1–2 Hr/day, 2–3 Hr/day, > 3 Hr/day)
  tvTime?: number;
  mobileTime?: number;
  computerTime?: number;
  schoolReading?: number;
  nonSchoolReading?: number;
  indoorGamesTime?: number;
  outdoorGamesTime?: number;
  tuitionTime?: number;
  // Legacy fields for backward compatibility
  homeworkTime?: number;
  readingTime?: number;
  gamingTime?: number;
  musicTime?: number;
}

export interface MentalHealth {
  bodyPerception?: number; // 1-5 scale
  bullyingExperience: boolean;
  weightGoal: 'lose' | 'gain' | 'maintain' | 'none';
  bodyImageSelection?: number; // 1-9 scale
  // Updated body image satisfaction fields to use numbers
  currentBodyImageSatisfaction?: number; // 1-9 scale from body chart
  desiredBodyImageSatisfaction?: number; // 1-9 scale from body chart
  // Mental health questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
  difficultyWalking?: number;
  difficultyRunning?: number;
  difficultySports?: number;
  difficultyAttention?: number;
  forgetThings?: number;
  troubleKeepingUp?: number;
  feelLonely?: number;
  wantEatLess?: number;
  // Legacy fields for backward compatibility
  mobilityIssues?: number;
}

export interface SleepQuality {
  // Sleep time fields
  bedtime?: string; // HH:MM format
  wakeupTime?: string; // HH:MM format
  sleepDuration?: number; // auto-computed in minutes
  // Sleep questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
  difficultyFallingAsleep?: number;
  wakeUpDuringSleep?: number;
  wakeUpFromNoise?: number;
  difficultyGettingBackToSleep?: number;
  sleepinessInClasses?: number;
  sleepHeadache?: number;
  sleepIrritation?: number;
  sleepLossOfInterest?: number;
  sleepForgetfulness?: number;
  // Legacy fields for backward compatibility
  sleepIssues: string[];
}

export interface HealthScores {
  eatingHabitsScore: number;
  physicalActivityScore: number;
  sedentaryScore: number;
  mentalHealthScore: number;
  sleepScore: number;
  // AI-generated score
  aiScore?: number;
}

export interface AIPrediction {
  riskLevel: "Low" | "Medium" | "High";
  riskPercentage: number;
  confidenceScore: number;
  explanation: string;
  keyRiskFactors: string[];
  recommendations: string[];
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
  aiPrediction?: AIPrediction;
}