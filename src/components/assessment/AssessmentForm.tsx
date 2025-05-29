
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
  
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({
    userId: currentUser?.uid || '',
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
      junkFood: 1,
      sweets: 1,
      softDrinks: 1,
      energyDrinks: 0,
    },
    physicalActivity: {
      ptFrequency: 2,
      ptDuration: 30,
      participation: true,
      indoorGames: 2,
      outdoorGames: 2,
      yoga: 0,
      dance: 0,
      swimming: 0,
      cycling: 0,
      walking: 0,
    },
    sedentaryBehavior: {
      tvTime: 2,
      mobileTime: 2,
      homeworkTime: 2,
      readingTime: 1,
      gamingTime: 1,
      tuitionTime: 1,
      musicTime: 0,
    },
    mentalHealth: {
      bodyPerception: 3,
      bullyingExperience: false,
      mobilityIssues: 1,
      weightGoal: 'maintain',
      bodyImageSelection: 5,
    },
    sleepQuality: {
      bedtime: '22:00',
      wakeupTime: '06:00',
      sleepIssues: [],
    },
  });

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
    const unhealthyFoods = (data.eatingHabits?.junkFood || 0) + 
                          (data.eatingHabits?.sweets || 0) + 
                          (data.eatingHabits?.softDrinks || 0) + 
                          (data.eatingHabits?.energyDrinks || 0);
    const eatingScore = Math.max(0, Math.min(10, (healthyFoods - unhealthyFoods + 10) / 2));

    // Calculate physical activity score
    const activityScore = Math.min(10, 
      ((data.physicalActivity?.ptFrequency || 0) * 1.5) + 
      ((data.physicalActivity?.outdoorGames || 0) * 0.5) + 
      ((data.physicalActivity?.indoorGames || 0) * 0.3)
    );

    // Calculate sedentary score (lower is better)
    const sedentaryTotal = (data.sedentaryBehavior?.tvTime || 0) + 
                          (data.sedentaryBehavior?.mobileTime || 0) + 
                          (data.sedentaryBehavior?.gamingTime || 0);
    const sedentaryScore = Math.max(0, 10 - (sedentaryTotal * 0.8));

    // Calculate mental health score
    const mentalScore = Math.min(10, 
      ((6 - (data.mentalHealth?.bodyPerception || 3)) * 2) + 
      (data.mentalHealth?.bullyingExperience ? 0 : 3) + 
      ((6 - (data.mentalHealth?.mobilityIssues || 1)) * 1.5)
    );

    // Calculate sleep score (based on sleep duration)
    const bedtime = data.sleepQuality?.bedtime ? new Date(`2000-01-01T${data.sleepQuality.bedtime}`) : new Date();
    const wakeup = data.sleepQuality?.wakeupTime ? new Date(`2000-01-02T${data.sleepQuality.wakeupTime}`) : new Date();
    const sleepHours = (wakeup.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    const sleepScore = Math.min(10, Math.max(0, 10 - Math.abs(sleepHours - 9)));

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
      const currentStepData = prev[step as keyof AssessmentData] || {};
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

      // Generate AI prediction
      const aiPrediction = await generateObesityPrediction({
        age: assessmentData.socioDemographic?.age,
        gender: assessmentData.socioDemographic?.gender,
        bmi,
        familyHistory: assessmentData.socioDemographic?.familyObesityHistory,
        ...scores
      });

      // Save to Firestore
      const finalAssessment = {
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
