import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SocioDemographicStep from './steps/SocioDemographicStep';
import EatingHabitsStep from './steps/EatingHabitsStep';
import PhysicalActivityStep from './steps/PhysicalActivityStep';
import SedentaryBehaviorStep from './steps/SedentaryBehaviorStep';
import MentalHealthStep from './steps/MentalHealthStep';
import SleepQualityStep from './steps/SleepQualityStep';
import { AssessmentData } from '../../types/assessment';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateObesityPrediction } from '../../config/gemini';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AssessmentForm: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const initialData: Partial<AssessmentData> = {
    socioDemographic: {
      schoolName: '',
      name: '',
      age: 0,
      gender: 'male',
      class: '',
      section: '',
      height: 0,
      weight: 0,
      address: '',
      hostelResident: false,
      fatherName: '',
      motherName: '',
      fatherContact: '',
      motherContact: '',
      brothers: 0,
      sisters: 0,
      birthOrder: 1,
      familyType: 'nuclear',
      familyObesity: 'no',
      familyDiabetes: 'no',
      familyHypertension: 'no',
      familyThyroid: 'no',
      // Legacy fields for backward compatibility
      hasSiblings: 'no',
      familyObesityHistory: false,
      diabetesHistory: false,
      bpHistory: false,
      thyroidHistory: false,
    },
    eatingHabits: {
      cereals: 2,
      pulses: 2,
      vegetables: 2,
      fruits: 2,
      milkProducts: 2,
      // New consolidated non-veg field
      nonVegConsumption: 1, // Default to rarely
      // Processed foods
      snacks: 1,
      beverages: 1,
      sweets: 1,
      // Legacy fields for backward compatibility
      chicken: 1,
      fish: 1,
      eggs: 1,
      seafood: 1,
      leanMeats: 1,
      nonVeg: 1,
      junkFood: 1,
      softDrinks: 1,
      energyDrinks: 1,
    },
    physicalActivity: {
      ptFrequency: 2,
      ptDuration: 30,
      participation: true,
      scouts: false,
      ncc: false,
      otherActivities: false,
      noActivities: false,
      yoga: { days: 0, minutes: 0 },
      exercise: { days: 0, minutes: 0 },
      indoorGames: { days: 2, minutes: 60 },
      outdoorGames: { days: 3, minutes: 120 },
      playAfterSchool: { days: 5, minutes: 60 },
      cycling: { days: 0, minutes: 0 },
      walking: { days: 3, minutes: 60 },
      dance: 0,
      swimming: 0,
    },
    sedentaryBehavior: {
      tvTime: 2,
      mobileTime: 2,
      schoolReading: 2,
      nonSchoolReading: 1,
      indoorGamesTime: 1,
      outdoorGamesTime: 0,
      tuitionTime: 1,
      homeworkTime: 2,
      readingTime: 1,
      gamingTime: 1,
      musicTime: 0,
    },
    mentalHealth: {
      bodyPerception: 3,
      bullyingExperience: false,
      weightGoal: 'maintain',
      bodyImageSelection: 5,
      currentBodyImageSatisfaction: 3,
      desiredBodyImageSatisfaction: 4,
      difficultyWalking: 0,
      difficultyRunning: 0,
      difficultySports: 0,
      difficultyAttention: 1,
      forgetThings: 1,
      troubleKeepingUp: 1,
      feelLonely: 0,
      wantEatLess: 0,
      mobilityIssues: 1,
    },
    sleepQuality: {
      bedtime: '22:00',
      wakeupTime: '06:00',
      sleepIssues: [],
      difficultyFallingAsleep: 1,
      wakeUpDuringSleep: 1,
      wakeUpFromNoise: 1,
      difficultyGettingBackToSleep: 1,
      sleepinessInClasses: 1,
      sleepHeadache: 0,
      sleepIrritation: 1,
      sleepLossOfInterest: 0,
      sleepForgetfulness: 1,
    },
  };

  const [assessmentData, setAssessmentData] = useState(initialData);

  const steps = [
    { title: 'Personal Information', component: SocioDemographicStep },
    { title: 'Eating Habits', component: EatingHabitsStep },
    { title: 'Physical Activity', component: PhysicalActivityStep },
    { title: ' Sedentary Behavior', component: SedentaryBehaviorStep },
    { title: 'Mental Health & Body Image', component: MentalHealthStep },
    { title: 'Sleep Quality', component: SleepQualityStep },
  ];

  const calculateBMI = (height: number, weight: number) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return 0;
  };

  // Enhanced scoring system with better accuracy
  const getActivityValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value !== null && 'days' in value && 'minutes' in value) {
      return (value.days || 0) * (value.minutes || 0);
    }
    return 0;
  };

  const calculateScores = (data: Partial<AssessmentData>) => {
    // Enhanced eating habits score with weighted calculations
    const healthyFoods = ((data.eatingHabits?.cereals || 0) * 1.2) + 
                        ((data.eatingHabits?.pulses || 0) * 1.5) + 
                        ((data.eatingHabits?.vegetables || 0) * 2.0) + 
                        ((data.eatingHabits?.fruits || 0) * 1.8) + 
                        ((data.eatingHabits?.milkProducts || 0) * 1.3) +
                        ((data.eatingHabits?.nonVegConsumption || 0) * 1.0); // Include new field
    
    const unhealthyFoods = ((data.eatingHabits?.snacks || 0) * 1.5) + 
                          ((data.eatingHabits?.beverages || 0) * 2.0) + 
                          ((data.eatingHabits?.sweets || 0) * 1.8);
    
    const eatingScore = Math.max(0, Math.min(10, (healthyFoods - unhealthyFoods + 20) / 4));

    // Enhanced physical activity score with PT participation
    const ptScore = data.physicalActivity?.participation ? 
                   ((data.physicalActivity?.ptFrequency || 0) * (data.physicalActivity?.ptDuration || 0)) / 10 : 0;
    
    const totalActivity = ptScore + 
                         getActivityValue(data.physicalActivity?.yoga) / 100 + 
                         getActivityValue(data.physicalActivity?.exercise) / 100 + 
                         getActivityValue(data.physicalActivity?.indoorGames) / 100 + 
                         getActivityValue(data.physicalActivity?.outdoorGames) / 100 + 
                         getActivityValue(data.physicalActivity?.playAfterSchool) / 100 + 
                         getActivityValue(data.physicalActivity?.cycling) / 100 + 
                         getActivityValue(data.physicalActivity?.walking) / 100;
    
    const activityScore = Math.min(10, totalActivity / 5); // Adjusted scoring scale

    // Enhanced sedentary behavior scoring with screen time emphasis
    const screenTime = ((data.sedentaryBehavior?.tvTime || 0) * 1.5) + 
                      ((data.sedentaryBehavior?.mobileTime || 0) * 2.0);
    
    const otherSedentary = (data.sedentaryBehavior?.schoolReading || 0) + 
                          (data.sedentaryBehavior?.nonSchoolReading || 0) + 
                          (data.sedentaryBehavior?.indoorGamesTime || 0) + 
                          (data.sedentaryBehavior?.tuitionTime || 0);
    
    const sedentaryScore = Math.max(0, 10 - ((screenTime * 1.2) + (otherSedentary * 0.8)));

    // Enhanced mental health scoring with weight perception
    const bodyPerceptionPenalty = Math.abs((data.mentalHealth?.bodyPerception || 3) - 3) * 0.5;
    const bullyingPenalty = data.mentalHealth?.bullyingExperience ? 2 : 0;
    
    const mentalHealthIssues = ((data.mentalHealth?.difficultyWalking || 0) * 1.2) + 
                              ((data.mentalHealth?.difficultyRunning || 0) * 1.0) + 
                              ((data.mentalHealth?.difficultySports || 0) * 1.0) + 
                              ((data.mentalHealth?.difficultyAttention || 0) * 1.5) + 
                              ((data.mentalHealth?.forgetThings || 0) * 1.0) + 
                              ((data.mentalHealth?.troubleKeepingUp || 0) * 1.3) + 
                              ((data.mentalHealth?.feelLonely || 0) * 2.0) + 
                              ((data.mentalHealth?.wantEatLess || 0) * 1.5) +
                              bodyPerceptionPenalty + bullyingPenalty;
    
    const mentalScore = Math.max(0, 10 - (mentalHealthIssues * 0.3));

    // Enhanced sleep scoring with bedtime analysis
    const calculateSleepDuration = () => {
      if (data.sleepQuality?.bedtime && data.sleepQuality?.wakeupTime) {
        const bedTime = new Date(`1970-01-01T${data.sleepQuality.bedtime}:00`);
        const wakeTime = new Date(`1970-01-02T${data.sleepQuality.wakeupTime}:00`);
        const duration = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60 * 60);
        return duration;
      }
      return 8; // Default assumption
    };

    const sleepDuration = calculateSleepDuration();
    const sleepDurationScore = sleepDuration >= 8 && sleepDuration <= 10 ? 2 : 
                             (sleepDuration >= 7 && sleepDuration <= 11 ? 1 : 0);

    const sleepIssues = ((data.sleepQuality?.difficultyFallingAsleep || 0) * 1.2) + 
                       ((data.sleepQuality?.wakeUpDuringSleep || 0) * 1.0) + 
                       ((data.sleepQuality?.wakeUpFromNoise || 0) * 0.8) + 
                       ((data.sleepQuality?.difficultyGettingBackToSleep || 0) * 1.0) + 
                       ((data.sleepQuality?.sleepinessInClasses || 0) * 1.5) + 
                       ((data.sleepQuality?.sleepHeadache || 0) * 1.3) + 
                       ((data.sleepQuality?.sleepIrritation || 0) * 1.2) + 
                       ((data.sleepQuality?.sleepLossOfInterest || 0) * 1.4) + 
                       ((data.sleepQuality?.sleepForgetfulness || 0) * 1.1);
    
    const sleepScore = Math.max(0, 10 - (sleepIssues * 0.25) + sleepDurationScore);

    return {
      eatingHabitsScore: Math.round(eatingScore * 10) / 10,
      physicalActivityScore: Math.round(activityScore * 10) / 10,
      sedentaryScore: Math.round(sedentaryScore * 10) / 10,
      mentalHealthScore: Math.round(mentalScore * 10) / 10,
      sleepScore: Math.round(sleepScore * 10) / 10
    };
  };

  const updateAssessmentData = (step: string, data: any) => {
    setAssessmentData(prev => {
      const currentStepData = prev[step as keyof typeof prev] || {};
      return {
        ...prev,
        [step]: { ...currentStepData, ...data }
      };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      // Validate required fields
      const requiredFields = {
        'Personal Information': {
          name: assessmentData.socioDemographic?.name,
          age: assessmentData.socioDemographic?.age,
          gender: assessmentData.socioDemographic?.gender,
          height: assessmentData.socioDemographic?.height,
          weight: assessmentData.socioDemographic?.weight
        }
      };

      const missingFields = Object.entries(requiredFields).reduce((acc, [step, fields]) => {
        const missing = Object.entries(fields)
          .filter(([_, value]) => !value)
          .map(([field]) => field);
        if (missing.length > 0) {
          acc[step] = missing;
        }
        return acc;
      }, {} as Record<string, string[]>);

      if (Object.keys(missingFields).length > 0) {
        const errorMessage = Object.entries(missingFields)
          .map(([step, fields]) => `${step}: ${fields.join(', ')}`)
          .join('\n');
        
        toast({
          title: "Missing Required Fields",
          description: `Please fill in the following required fields:\n${errorMessage}`,
          variant: "destructive",
          duration: 5000
        });
        return;
      }

      // Calculate BMI
      const bmi = calculateBMI(
        assessmentData.socioDemographic?.height || 0,
        assessmentData.socioDemographic?.weight || 0
      );

      // Validate BMI range
      if (bmi < 10 || bmi > 50) {
        toast({
          title: "Invalid BMI",
          description: "Please check the height and weight values. The calculated BMI is outside the expected range.",
          variant: "destructive",
          duration: 5000
        });
        return;
      }

      // Calculate enhanced scores
      const scores = calculateScores(assessmentData);

      // Generate comprehensive AI prediction
      const aiPredictionData = {
        name: assessmentData.socioDemographic?.name || '',
        age: assessmentData.socioDemographic?.age || 0,
        gender: assessmentData.socioDemographic?.gender || 'male',
        bmi,
        scores,
        eatingHabits: assessmentData.eatingHabits || {},
        physicalActivity: assessmentData.physicalActivity || {},
        sedentaryBehavior: assessmentData.sedentaryBehavior || {},
        sleepQuality: assessmentData.sleepQuality || {},
        mentalHealth: assessmentData.mentalHealth || {},
        familyHistory: {
          obesity: assessmentData.socioDemographic?.familyObesity === 'yes',
          diabetes: assessmentData.socioDemographic?.familyDiabetes === 'yes',
          hypertension: assessmentData.socioDemographic?.familyHypertension === 'yes',
          thyroid: assessmentData.socioDemographic?.familyThyroid === 'yes'
        }
      };

      const aiPrediction = await generateObesityPrediction(aiPredictionData);

      // Save comprehensive assessment to Firestore
      const finalAssessment = {
        userId: currentUser?.uid || '',
        ...assessmentData,
        bmi,
        aiPrediction,
        completedAt: new Date(),
        scores,
        metadata: {
          version: '2.0',
          formStructure: 'enhanced',
          scoringAlgorithm: 'weighted'
        }
      };

      await addDoc(collection(db, 'assessments'), finalAssessment);

      toast({
        title: "Assessment Completed!",
        description: "Your comprehensive health assessment has been successfully submitted.",
        duration: 5000
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit assessment. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">
            Health Assessment Form
          </CardTitle>
          <CardDescription className="text-center text-base md:text-lg">
            Please fill out all required fields to complete your assessment
          </CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          <div className="text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {steps.length}
      </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          <CurrentStepComponent
            data={assessmentData}
            updateData={updateAssessmentData}
          />

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
                type="submit" 
                className="w-full"
            disabled={loading}
          >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assessment'
                )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-[#3F51B5] hover:bg-[#303F9F] text-white"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentForm;
