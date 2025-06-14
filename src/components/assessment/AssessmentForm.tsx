import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SocioDemographicStep from './steps/SocioDemographicStep';
import EatingHabitsStep from './steps/EatingHabitsStep';
import PhysicalActivityStep from './steps/PhysicalActivityStep';
import SedentaryBehaviorStep from './steps/SedentaryBehaviorStep';
import MentalHealthStep from './steps/MentalHealthStep';
import SleepQualityStep from './steps/SleepQualityStep';
import { AssessmentData } from '../../types/assessment';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateObesityPrediction } from '../../config/gemini';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AssessmentForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  
  const initialData: Partial<AssessmentData> = {
    socioDemographic: {
      schoolName: '',
      name: '',
      age: undefined,
      gender: 'none',
      class: '',
      section: '',
      height: undefined,
      weight: undefined,
      address: '',
      hostelResident: false,
      fatherName: '',
      motherName: '',
      fatherContact: '',
      motherContact: '',
      brothers: 0,
      sisters: 0,
      birthOrder: undefined,
      familyType: 'none',
      familyObesity: 'none',
      familyDiabetes: 'none',
      familyHypertension: 'none',
      familyThyroid: 'none',
      // Legacy fields for backward compatibility
      hasSiblings: 'none',
      familyObesityHistory: false,
      diabetesHistory: false,
      bpHistory: false,
      thyroidHistory: false,
    },
    eatingHabits: {
      cereals: undefined,
      pulses: undefined,
      vegetables: undefined,
      fruits: undefined,
      milkProducts: undefined,
      nonVegConsumption: undefined,
      snacks: undefined,
      beverages: undefined,
      sweets: undefined,
      chicken: undefined,
      fish: undefined,
      eggs: undefined,
      seafood: undefined,
      leanMeats: undefined,
      nonVeg: undefined,
      junkFood: undefined,
      softDrinks: undefined,
      energyDrinks: undefined,
    },
    physicalActivity: {
      ptFrequency: undefined,
      ptDuration: undefined,
      participation: false,
      scouts: false,
      ncc: false,
      otherActivities: false,
      noActivities: false,
      yoga: { days: undefined, minutes: 'none' },
      exercise: { days: undefined, minutes: 'none' },
      indoorGames: { days: undefined, minutes: 'none' },
      outdoorGames: { days: undefined, minutes: 'none' },
      playAfterSchool: { days: undefined, minutes: 'none' },
      cycling: { days: undefined, minutes: 'none' },
      walking: { days: undefined, minutes: 'none' },
      dance: undefined,
      swimming: undefined,
    },
    sedentaryBehavior: {
      tvTime: undefined,
      mobileTime: undefined,
      schoolReading: undefined,
      nonSchoolReading: undefined,
      indoorGamesTime: undefined,
      outdoorGamesTime: undefined,
      tuitionTime: undefined,
      homeworkTime: undefined,
      readingTime: undefined,
      gamingTime: undefined,
      musicTime: undefined,
    },
    mentalHealth: {
      bodyPerception: undefined,
      bullyingExperience: false,
      weightGoal: 'none',
      bodyImageSelection: undefined,
      currentBodyImageSatisfaction: undefined,
      desiredBodyImageSatisfaction: undefined,
      difficultyWalking: undefined,
      difficultyRunning: undefined,
      difficultySports: undefined,
      difficultyAttention: undefined,
      forgetThings: undefined,
      troubleKeepingUp: undefined,
      feelLonely: undefined,
      wantEatLess: undefined,
      mobilityIssues: undefined,
    },
    sleepQuality: {
      bedtime: 'none',
      wakeupTime: 'none',
      sleepIssues: [],
      difficultyFallingAsleep: undefined,
      wakeUpDuringSleep: undefined,
      wakeUpFromNoise: undefined,
      difficultyGettingBackToSleep: undefined,
      sleepinessInClasses: undefined,
      sleepHeadache: undefined,
      sleepIrritation: undefined,
      sleepLossOfInterest: undefined,
      sleepForgetfulness: undefined,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Show generating result state
      setIsGeneratingResult(true);
      setLoadingStep('preparing');
      toast({
        title: "Preparing Assessment",
        description: "Loading student data and preparing health records...",
        duration: 5000
      });

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
        setIsSubmitting(false);
        setIsGeneratingResult(false);
        return;
      }

      setLoadingStep('analyzing');
      toast({
        title: "Analyzing Data",
        description: "Processing your health information...",
        duration: 5000
      });

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

      console.log('Generating AI prediction with data:', aiPredictionData);
      const aiPrediction = await generateObesityPrediction(aiPredictionData);
      console.log('AI prediction received:', aiPrediction);

      if (!aiPrediction || !aiPrediction.riskLevel) {
        throw new Error('Failed to generate AI prediction');
      }

      // Save comprehensive assessment to Firestore
      const finalAssessment = {
        userId: user?.uid || '',
        ...assessmentData,
        bmi,
        aiPrediction,
        completedAt: new Date(),
        scores,
        metadata: {
          version: '2.0',
          formStructure: 'enhanced',
          scoringAlgorithm: 'weighted'
        },
        timestamp: serverTimestamp()
      };

      console.log('Saving assessment to Firestore:', finalAssessment);
      const assessmentRef = await addDoc(collection(db, 'assessments'), finalAssessment);
      console.log('Assessment saved with ID:', assessmentRef.id);

      setLoadingStep('complete');
      toast({
        title: "Assessment Complete",
        description: "Your health assessment has been successfully generated.",
        variant: "success",
        duration: 5000
      });

      // Prepare data for result page
      const resultData = {
        assessmentData: {
          ...finalAssessment,
          id: assessmentRef.id,
          timestamp: new Date().toISOString()
        },
        aiPrediction: {
          riskLevel: aiPrediction.riskLevel,
          riskPercentage: aiPrediction.riskPercentage,
          recommendations: aiPrediction.recommendations || [],
          keyRiskFactors: aiPrediction.keyRiskFactors || [],
          explanation: aiPrediction.explanation || ''
        }
      };

      console.log('Navigating to result page with data:', resultData);
      navigate('/assessment/result', { state: resultData });
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during submission');
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'An error occurred during submission',
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      setIsGeneratingResult(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isGeneratingResult) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-6 max-w-sm mx-auto">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Processing Your Assessment</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {loadingStep === 'preparing' && "Loading student data and preparing health records..."}
              {loadingStep === 'analyzing' && "Analyzing your health information and generating insights..."}
              {loadingStep === 'saving' && "Saving your assessment results..."}
              {loadingStep === 'complete' && "Assessment complete! Redirecting to results..."}
            </p>
          </div>
          <div className="w-48 sm:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: loadingStep === 'preparing' ? '25%' :
                       loadingStep === 'analyzing' ? '50%' :
                       loadingStep === 'saving' ? '75%' :
                       loadingStep === 'complete' ? '100%' : '0%'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="space-y-3 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Health Assessment Form
          </CardTitle>
          <CardDescription className="text-sm sm:text-base md:text-lg text-center">
            Please fill out all required fields to complete your assessment
          </CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          <div className="text-xs sm:text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {steps.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CurrentStepComponent
              data={assessmentData}
              updateData={updateAssessmentData}
            />

            <div className="flex justify-between items-center pt-4 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 h-9 sm:h-10"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  className="flex-1 h-9 sm:h-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Submit Assessment</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 h-9 sm:h-10"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentForm;
