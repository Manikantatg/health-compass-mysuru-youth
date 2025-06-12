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
  // New consolidated non-veg field
  nonVegConsumption: number; // 0-4 scale: Never, Rarely, Sometimes, Very often, Almost always
  // Processed foods
  snacks: number;
  beverages: number;
  sweets: number;
  // Legacy fields for backward compatibility
  chicken: number;
  fish: number;
  eggs: number;
  seafood: number;
  leanMeats: number;
  nonVeg: number;
  junkFood: number;
  softDrinks: number;
  energyDrinks: number;
}

export interface PhysicalActivity {
  ptFrequency: number; // 0-7 days
  ptDuration: number; // minutes
  ptActivityType?: string; // New field: 'indoor' | 'outdoor'
  participation: boolean;
  // New school activities
  scouts?: boolean;
  ncc?: boolean;
  otherActivities?: boolean;
  otherActivitiesDetail?: string;
  noActivities?: boolean; // New "None" option
  // Updated activities with days and minutes structure
  yoga: { days: number; minutes: string } | number;
  exercise: { days: number; minutes: string } | number;
  indoorGames: { days: number; minutes: string } | number;
  outdoorGames: { days: number; minutes: string } | number;
  playAfterSchool: { days: number; minutes: string } | number;
  cycling: { days: number; minutes: string } | number;
  walking: { days: number; minutes: string } | number;
  // Legacy fields for backward compatibility
  dance: number;
  swimming: number;
}

export interface SedentaryBehavior {
  // Updated to use 0-4 scale (Never, < 1 Hr/day, 1–2 Hr/day, 2–3 Hr/day, > 3 Hr/day)
  tvTime: number;
  mobileTime: number;
  schoolReading: number;
  nonSchoolReading: number;
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
  // Updated body image satisfaction fields to use numbers
  currentBodyImageSatisfaction?: number; // 1-9 scale from body chart
  desiredBodyImageSatisfaction?: number; // 1-9 scale from body chart
  // Mental health questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
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
  // Sleep time fields
  bedtime?: string; // HH:MM format
  wakeupTime?: string; // HH:MM format
  sleepDuration?: number; // auto-computed in minutes
  // Sleep questions (0-4 scale: Never, Rarely, Sometimes, Often, Almost Always)
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

export interface Student {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  schoolName: string;
  class: string;
  section: string;
  birthOrder: number;
  brothers: number;
  sisters: number;
  familyType: string;
  hostelResident: boolean;
}

export interface PhysicalActivity {
  ptFrequency: number;
  ptDuration: number;
  participation: boolean;
  indoorGames: { days: number; minutes: string };
  outdoorGames: { days: number; minutes: string };
  yoga: { days: number; minutes: string };
  cycling: { days: number; minutes: string };
  walking: { days: number; minutes: string };
  playAfterSchool: { days: number; minutes: string };
}

export interface EatingHabits {
  fruits: number;
  vegetables: number;
  cereals: number;
  pulses: number;
  milkProducts: number;
  nonVegConsumption: number;
  snacks: number;
  beverages: number;
  sweets: number;
  junkFood: number;
  softDrinks: number;
  energyDrinks: number;
}

export interface SedentaryBehavior {
  tvTime: number;
  mobileTime: number;
  computerTime: number;
  schoolReading: number;
  nonSchoolReading: number;
  homeworkTime: number;
  gamingTime: number;
}

export interface SleepQuality {
  bedtime: string;
  wakeupTime: string;
  sleepDuration: number;
  difficultyFallingAsleep: number;
  wakeUpDuringSleep: number;
  difficultyGettingBackToSleep: number;
  sleepinessInClasses: number;
  sleepHeadache: number;
}

export interface MentalHealth {
  bodyPerception: number;
  bullyingExperience: boolean;
  weightGoal: string;
  currentBodyImageSatisfaction: number;
  desiredBodyImageSatisfaction: number;
  difficultyAttention: number;
  forgetThings: number;
  feelLonely: number;
  troubleKeepingUp: number;
}

export interface FamilyHistory {
  obesity: string;
  diabetes: string;
  hypertension: string;
}

export interface AssessmentResponses {
  physicalActivity: PhysicalActivity;
  nutrition: EatingHabits;
  sedentaryBehavior: SedentaryBehavior;
  sleep: SleepQuality;
  mentalHealth: MentalHealth;
  familyHistory: FamilyHistory;
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
  student: Student;
  responses: AssessmentResponses;
  completedAt: Date;
  aiPrediction?: AIPrediction;
}
