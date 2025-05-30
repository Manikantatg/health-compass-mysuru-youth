
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  const initialData = {
    socioDemographic: {
      schoolName: '',
      name: '',
      age: 0,
      gender: 'male' as const,
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
      familyType: 'nuclear' as const,
      hasSiblings: 'no' as const,
      familyObesity: 'no' as const,
      familyDiabetes: 'no' as const,
      familyHypertension: 'no' as const,
      familyThyroid: 'no' as const,
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
      nonVeg: 1,
      snacks: 1,
      beverages: 1,
      sweets: 1,
      // Legacy fields for backward compatibility
      junkFood: 1,
      softDrinks: 1,
      energyDrinks: 1,
    },
    physicalActivity: {
      ptFrequency: 2,
      ptDuration: 30,
      participation: true,
      yoga: 0,
      exercise: 0,
      indoorGames: 60,
      outdoorGames: 120,
      playAfterSchool: 60,
      cycling: 0,
      walking: 60,
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
      weightGoal: 'maintain' as const,
      bodyImageSelection: 5,
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
    { title: 'Screen Time & Sedentary Behavior', component: SedentaryBehaviorStep },
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

  const calculateScores = (data: Partial<AssessmentData>) => {
    // Calculate eating habits score (healthy foods vs unhealthy)
    const healthyFoods = (data.eatingHabits?.cereals || 0) + 
                        (data.eatingHabits?.pulses || 0) + 
                        (data.eatingHabits?.vegetables || 0) + 
                        (data.eatingHabits?.fruits || 0) + 
                        (data.eatingHabits?.milkProducts || 0);
    const unhealthyFoods = (data.eatingHabits?.snacks || 0) + 
                          (data.eatingHabits?.beverages || 0) + 
                          (data.eatingHabits?.sweets || 0);
    const eatingScore = Math.max(0, Math.min(10, (healthyFoods - unhealthyFoods + 10) / 2));

    // Calculate physical activity score (convert minutes to appropriate scale)
    const totalActivity = ((data.physicalActivity?.ptFrequency || 0) * (data.physicalActivity?.ptDuration || 0)) + 
                         (data.physicalActivity?.yoga || 0) + 
                         (data.physicalActivity?.exercise || 0) + 
                         (data.physicalActivity?.indoorGames || 0) + 
                         (data.physicalActivity?.outdoorGames || 0) + 
                         (data.physicalActivity?.playAfterSchool || 0) + 
                         (data.physicalActivity?.cycling || 0) + 
                         (data.physicalActivity?.walking || 0);
    const activityScore = Math.min(10, totalActivity / 42); // 420 minutes per week = 10 points

    // Calculate sedentary score (lower is better)
    const sedentaryTotal = (data.sedentaryBehavior?.tvTime || 0) + 
                          (data.sedentaryBehavior?.mobileTime || 0) + 
                          (data.sedentaryBehavior?.schoolReading || 0) + 
                          (data.sedentaryBehavior?.nonSchoolReading || 0);
    const sedentaryScore = Math.max(0, 10 - (sedentaryTotal * 0.8));

    // Calculate mental health score
    const mentalHealthIssues = (data.mentalHealth?.difficultyWalking || 0) + 
                              (data.mentalHealth?.difficultyRunning || 0) + 
                              (data.mentalHealth?.difficultySports || 0) + 
                              (data.mentalHealth?.difficultyAttention || 0) + 
                              (data.mentalHealth?.forgetThings || 0) + 
                              (data.mentalHealth?.troubleKeepingUp || 0) + 
                              (data.mentalHealth?.feelLonely || 0) + 
                              (data.mentalHealth?.wantEatLess || 0);
    const mentalScore = Math.max(0, 10 - (mentalHealthIssues * 0.3));

    // Calculate sleep score
    const sleepIssues = (data.sleepQuality?.difficultyFallingAsleep || 0) + 
                       (data.sleepQuality?.wakeUpDuringSleep || 0) + 
                       (data.sleepQuality?.wakeUpFromNoise || 0) + 
                       (data.sleepQuality?.difficultyGettingBackToSleep || 0) + 
                       (data.sleepQuality?.sleepinessInClasses || 0) + 
                       (data.sleepQuality?.sleepHeadache || 0) + 
                       (data.sleepQuality?.sleepIrritation || 0) + 
                       (data.sleepQuality?.sleepLossOfInterest || 0) + 
                       (data.sleepQuality?.sleepForgetfulness || 0);
    const sleepScore = Math.max(0, 10 - (sleepIssues * 0.25));

    return {
      eatingHabitsScore: Math.round(eatingScore),
      physicalActivityScore: Math.round(activityScore),
      sedentaryScore: Math.round(sedentaryScore),
      mentalHealthScore: Math.round(mentalScore),
      sleepScore: Math.round(sleepScore)
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
      // Calculate BMI
      const bmi = calculateBMI(
        assessmentData.socioDemographic?.height || 0,
        assessmentData.socioDemographic?.weight || 0
      );

      // Calculate scores
      const scores = calculateScores(assessmentData);

      // Generate AI prediction - fix the type issue here
      const familyHistory = assessmentData.socioDemographic?.familyObesity === 'yes' || 
                           assessmentData.socioDemographic?.familyDiabetes === 'yes' ||
                           assessmentData.socioDemographic?.familyHypertension === 'yes' ||
                           assessmentData.socioDemographic?.familyThyroid === 'yes';

      const aiPrediction = await generateObesityPrediction({
        age: assessmentData.socioDemographic?.age,
        gender: assessmentData.socioDemographic?.gender,
        bmi,
        familyHistory,
        ...scores
      });

      // Save to Firestore
      const finalAssessment = {
        userId: currentUser?.uid || '',
        ...assessmentData,
        bmi,
        aiPrediction,
        completedAt: new Date(),
        scores
      };

      await addDoc(collection(db, 'assessments'), finalAssessment);

      toast({
        title: "Assessment Completed!",
        description: "Your health assessment has been successfully submitted."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Health Assessment</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={assessmentData}
            updateData={updateAssessmentData}
          />

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={submitAssessment}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <span>{loading ? 'Submitting...' : 'Submit Assessment'}</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentForm;
