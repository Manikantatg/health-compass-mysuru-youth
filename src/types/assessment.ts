
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
  junkFood: number;
  sweets: number;
  softDrinks: number;
  energyDrinks: number;
}

export interface PhysicalActivity {
  ptFrequency: number; // 0-6 days
  ptDuration: number; // minutes
  participation: boolean;
  indoorGames: number; // hours per week
  outdoorGames: number;
  yoga: number;
  dance: number;
  swimming: number;
  cycling: number;
  walking: number;
}

export interface SedentaryBehavior {
  tvTime: number; // 0-4 scale
  mobileTime: number;
  homeworkTime: number;
  readingTime: number;
  gamingTime: number;
  tuitionTime: number;
  musicTime: number;
}

export interface MentalHealth {
  bodyPerception: number; // 1-5 scale
  bullyingExperience: boolean;
  mobilityIssues: number; // 1-5 scale
  weightGoal: 'lose' | 'gain' | 'maintain';
  bodyImageSelection: number; // 1-9 scale
}

export interface SleepQuality {
  bedtime: string;
  wakeupTime: string;
  sleepIssues: string[];
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
  aiPrediction?: {
    riskLevel: 'Low' | 'Medium' | 'High';
    riskPercentage: number;
    recommendations: string[];
    explanation: string;
  };
}
