import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

// Get the generative model
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateObesityPrediction = async (assessmentData: any) => {
  try {
    // Calculate scores based on the specified logic with proper null checks
    const bmiScore = getBMIScore(assessmentData.bmi || 0);
    const dietScore = getDietScore(assessmentData.eatingHabits || {});
    const activityScore = getActivityScore(assessmentData.physicalActivity || {});
    const screenScore = getScreenScore(assessmentData.sedentaryBehavior || {});
    const sleepScore = getSleepScore(assessmentData.sleepQuality || {});
    const mentalScore = getMentalHealthScore(assessmentData.mentalHealth || {});
    
    const totalScore = bmiScore + dietScore + activityScore + screenScore + sleepScore + mentalScore;
    
    // Determine risk level based on total score (max 12 points)
    let riskLevel: 'Low' | 'Medium' | 'High';
    let riskPercentage: number;
    
    if (totalScore >= 9) {
      riskLevel = 'Low';
      riskPercentage = Math.round(15 + (totalScore - 9) * 5); // 15-30%
    } else if (totalScore >= 5) {
      riskLevel = 'Medium';
      riskPercentage = Math.round(35 + (totalScore - 5) * 10); // 35-75%
    } else {
      riskLevel = 'High';
      riskPercentage = Math.round(75 + totalScore * 5); // 75-95%
    }

    // Generate key risk factors based on scores
    const keyRiskFactors = [];
    if (bmiScore < 1) keyRiskFactors.push('BMI indicates potential weight concerns');
    if (dietScore < 1) keyRiskFactors.push('Current eating habits may need improvement');
    if (activityScore < 1) keyRiskFactors.push('Physical activity levels are below recommended');
    if (screenScore < 1) keyRiskFactors.push('High screen time may impact health');
    if (sleepScore < 1) keyRiskFactors.push('Sleep patterns may need attention');
    if (mentalScore < 1) keyRiskFactors.push('Mental health aspects need support');

    // Generate recommendations based on risk factors
    const recommendations = [];
    if (bmiScore < 1) recommendations.push('Work with healthcare provider to establish healthy weight goals');
    if (dietScore < 1) recommendations.push('Increase consumption of fruits, vegetables, and whole grains');
    if (activityScore < 1) recommendations.push('Aim for 60 minutes of physical activity daily');
    if (screenScore < 1) recommendations.push('Limit screen time to 2 hours per day');
    if (sleepScore < 1) recommendations.push('Maintain consistent sleep schedule of 8-10 hours');
    if (mentalScore < 1) recommendations.push('Practice stress management techniques');

    // Generate explanation
    const explanation = `Based on the assessment, you have a ${riskLevel.toLowerCase()} risk level (${riskPercentage}%). 
    This is determined by analyzing your BMI, eating habits, physical activity, screen time, sleep patterns, and mental health. 
    ${keyRiskFactors.length > 0 ? 'Key areas of concern include: ' + keyRiskFactors.join(', ') : 'Your overall health indicators are positive.'}`;

    return {
      riskLevel,
      riskPercentage,
      explanation,
      recommendations,
      keyRiskFactors,
      preventiveMeasures: recommendations
    };
  } catch (error) {
    console.error('Error generating prediction:', error);
    // Return a fallback response
    return {
      riskLevel: 'Medium',
      riskPercentage: 50,
      explanation: 'Unable to generate detailed analysis. Please consult with a healthcare provider.',
      recommendations: [
        'Maintain regular physical activity',
        'Follow a balanced diet',
        'Get adequate sleep',
        'Limit screen time',
        'Practice stress management'
      ],
      keyRiskFactors: [
        'Unable to determine specific risk factors',
        'Please consult with a healthcare provider for detailed assessment'
      ],
      preventiveMeasures: [
        'Regular health check-ups',
        'Balanced lifestyle',
        'Healthy eating habits'
      ]
    };
  }
};

function getBMIScore(bmi: number): number {
  if (bmi >= 18.5 && bmi < 25) return 2;
  if (bmi >= 17 && bmi < 30) return 1;
  return 0;
}

function getDietScore(eatingHabits: any): number {
  const healthy = ((eatingHabits.fruits || 0) + (eatingHabits.vegetables || 0) + (eatingHabits.cereals || 0) + (eatingHabits.pulses || 0)) / 4;
  const unhealthy = ((eatingHabits.snacks || 0) + (eatingHabits.sweets || 0) + (eatingHabits.beverages || 0)) / 3;
  const score = Math.max(0, 2 - Math.abs(unhealthy - healthy));
  return Math.min(2, score);
}

function getActivityScore(physicalActivity: any): number {
  const getActivityMinutes = (activity: any): number => {
    if (typeof activity === 'object' && activity?.days && activity?.minutes) {
      const minutesMap: { [key: string]: number } = {
        'less-than-1': 30,  // 30 minutes
        '1-2': 90,         // 1.5 hours
        '2-3': 150,        // 2.5 hours
        'more-than-3': 240  // 4 hours
      };
      return activity.days * (minutesMap[activity.minutes] || 0);
    }
    return Number(activity) || 0;
  };

  const totalMinutes = getActivityMinutes(physicalActivity.yoga || 0) + 
                      getActivityMinutes(physicalActivity.exercise || 0) + 
                      getActivityMinutes(physicalActivity.outdoorGames || 0);
  
  if (totalMinutes >= 420) return 2; // 60 min * 7 days
  if (totalMinutes >= 180) return 1; // 60 min * 3 days
  return 0;
}

function getScreenScore(sedentaryBehavior: any): number {
  const totalScreenTime = (sedentaryBehavior.tvTime || 0) + (sedentaryBehavior.mobileTime || 0);
  if (totalScreenTime <= 1) return 2; // 0-1 hours
  if (totalScreenTime <= 2) return 1; // 2-3 hours
  return 0; // 3+ hours
}

function getSleepScore(sleepQuality: any): number {
  const sleepDuration = sleepQuality.sleepDuration || 0;
  const sleepIssues = [
    sleepQuality.difficultyFallingAsleep,
    sleepQuality.wakeUpDuringSleep,
    sleepQuality.wakeUpFromNoise,
    sleepQuality.difficultyGettingBackToSleep,
    sleepQuality.sleepinessInClasses
  ].filter(Boolean).length;

  if (sleepDuration >= 480 && sleepIssues <= 1) return 2; // 8+ hours, minimal issues
  if (sleepDuration >= 360 && sleepIssues <= 2) return 1; // 6+ hours, some issues
  return 0;
}

function getMentalHealthScore(mentalHealth: any): number {
  const issues = [
    mentalHealth.difficultyWalking,
    mentalHealth.difficultyRunning,
    mentalHealth.difficultySports,
    mentalHealth.difficultyAttention,
    mentalHealth.forgetThings,
    mentalHealth.troubleKeepingUp,
    mentalHealth.feelLonely,
    mentalHealth.wantEatLess
  ].filter(score => score >= 2).length;

  if (issues <= 1) return 2;
  if (issues <= 3) return 1;
  return 0;
}

const generatePrompt = (assessment: any): string => {
  return `
You are a pediatric health expert AI analyzing a student's health assessment to predict their risk of developing obesity and related health issues. 
Analyze the following data and provide a detailed assessment:

Student Information:
- Age: ${assessment.socioDemographic.age} years
- Gender: ${assessment.socioDemographic.gender}
- School: ${assessment.socioDemographic.schoolName}
- Class: ${assessment.socioDemographic.class}

Current Health Metrics:
1. BMI: ${assessment.bmi} kg/m²
2. Physical Activity:
   - PT Sessions: ${assessment.physicalActivity.ptFrequency} times/week
   - Sports Participation: ${assessment.physicalActivity.sportsParticipation ? 'Yes' : 'No'}
   - Regular Exercise: ${assessment.physicalActivity.regularExercise ? 'Yes' : 'No'}

3. Eating Habits (times per week):
   - Fruits: ${assessment.eatingHabits.fruits}
   - Vegetables: ${assessment.eatingHabits.vegetables}
   - Snacks: ${assessment.eatingHabits.snacks}
   - Sweets: ${assessment.eatingHabits.sweets}
   - Beverages: ${assessment.eatingHabits.beverages}

4. Sleep Quality (scale 1-5):
   - Difficulty Falling Asleep: ${assessment.sleepQuality.difficultyFallingAsleep}
   - Wake Up During Sleep: ${assessment.sleepQuality.wakeUpDuringSleep}
   - Sleep Duration: ${assessment.sleepQuality.sleepDuration} hours

5. Mental Health:
   - Body Perception: ${assessment.mentalHealth.bodyPerception}
   - Stress Level: ${assessment.mentalHealth.stressLevel}
   - Anxiety Level: ${assessment.mentalHealth.anxietyLevel}

6. Sedentary Behavior (hours per day):
   - TV Time: ${assessment.sedentaryBehavior.tvTime}
   - Mobile Time: ${assessment.sedentaryBehavior.mobileTime}
   - Computer Time: ${assessment.sedentaryBehavior.computerTime}

Based on this data, provide a comprehensive analysis in the following format:

{
  "riskLevel": "Low/Medium/High",
  "riskPercentage": number between 0-100,
  "explanation": "Detailed explanation of the risk factors and their impact",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4",
    "Specific actionable recommendation 5"
  ],
  "keyRiskFactors": [
    "Primary risk factor 1 with explanation",
    "Primary risk factor 2 with explanation",
    "Primary risk factor 3 with explanation"
  ],
  "preventiveMeasures": [
    "Specific preventive measure 1",
    "Specific preventive measure 2",
    "Specific preventive measure 3"
  ]
}

Focus on:
1. Current BMI and its implications
2. Physical activity patterns and their impact
3. Dietary habits and their contribution to obesity risk
4. Sleep patterns and their effect on metabolism
5. Sedentary behavior and its consequences
6. Mental health factors that might influence eating habits

Provide specific, actionable recommendations that can help prevent obesity and improve overall health.
`;
};
