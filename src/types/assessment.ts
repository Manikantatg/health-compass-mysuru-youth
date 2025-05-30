
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
  birthOrder: number;
  familyType: 'nuclear' | 'joint' | 'three-generation';
  // New family history questions
  hasSiblings: 'yes' | 'no';
  familyObesity: 'yes' | 'no' | 'cannot-tell';
  familyObesityRelation?: 'father' | 'mother' | 'both-parents';
  familyDiabetes: 'yes' | 'no' | 'dont-know';
  familyDiabetesRelation?: 'father' | 'mother' | 'both-parents';
  familyHypertension: 'yes' | 'no' | 'dont-know';
  familyHypertensionRelation?: 'father' | 'mother' | 'both-parents';
  familyThyroid: 'yes' | 'no' | 'dont-know';
  familyThyroidRelation?: 'father' | 'mother' | 'both-parents';
  // Legacy fields for backward compatibility
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
  ptFrequency: number; // 0-6 days
  ptDuration: number; // minutes
  participation: boolean;
  // Updated activities (all in minutes per week)
  yoga: number;
  exercise: number;
  indoorGames: number; // Table Tennis, Badminton
  outdoorGames: number; // Cricket, Football, Kho-Kho
  playAfterSchool: number; // Play after school hours / Help with household chores
  cycling: number; // Self-transport via Bicycle
  walking: number;
  // Legacy fields for backward compatibility
  dance: number;
  swimming: number;
}

export interface SedentaryBehavior {
  tvTime: number; // 0-4 scale
  mobileTime: number;
  // Updated sedentary activities
  schoolReading: number; // Reading and Writing – School Related
  nonSchoolReading: number; // Reading and Writing – Non-School Related
  indoorGamesTime: number; // Playing Indoor Games: Carrom, Pacchi, etc.
  outdoorGamesTime: number; // Playing Outdoor Games: Antakshari, etc.
  tuitionTime: number; // Tuition Classes After School
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
  bedtime: string;
  wakeupTime: string;
  sleepIssues: string[];
}

export interface HealthScores {
  eatingHabitsScore: number;
  physicalActivityScore: number;
  sedentaryScore: number;
  mentalHealthScore: number;
  sleepScore: number;
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
  };
}
