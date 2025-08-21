import { GoogleGenerativeAI } from "@google/generative-ai";
import { AssessmentData } from "@/types/assessment";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface AIPrediction {
  riskLevel: "Low" | "Medium" | "High";
  riskPercentage: number;
  confidenceScore: number;
  explanation: string;
  keyRiskFactors: string[];
  recommendations: string[];
}

// Helper function to format assessment data for AI
const formatAssessmentData = (data: AssessmentData) => {
  const { socioDemographic, eatingHabits, physicalActivity, sedentaryBehavior, sleepQuality, mentalHealth } = data;
  
  // Extract and structure all relevant health assessment data
  const healthData = {
    socioDemographic: {
      name: socioDemographic.name || 'Not provided',
      age: socioDemographic.age || 0,
      gender: socioDemographic.gender || 'none',
      height: socioDemographic.height || 0,
      weight: socioDemographic.weight || 0,
      schoolName: socioDemographic.schoolName || 'Not provided',
      class: socioDemographic.class || 'Not provided',
      section: socioDemographic.section || 'Not provided',
      birthOrder: socioDemographic.birthOrder || 0,
      brothers: socioDemographic.brothers || 0,
      sisters: socioDemographic.sisters || 0,
      familyType: socioDemographic.familyType || 'none',
      hostelResident: socioDemographic.hostelResident || false,
      familyObesity: socioDemographic.familyObesity || 'none',
      familyDiabetes: socioDemographic.familyDiabetes || 'none',
      familyHypertension: socioDemographic.familyHypertension || 'none'
    },
    eatingHabits: {
      fruits: eatingHabits.fruits || 0,
      vegetables: eatingHabits.vegetables || 0,
      cereals: eatingHabits.cereals || 0,
      pulses: eatingHabits.pulses || 0,
      milkProducts: eatingHabits.milkProducts || 0,
      nonVegConsumption: eatingHabits.nonVegConsumption || 0,
      snacks: eatingHabits.snacks || 0,
      beverages: eatingHabits.beverages || 0,
      sweets: eatingHabits.sweets || 0,
      junkFood: eatingHabits.junkFood || 0,
      softDrinks: eatingHabits.softDrinks || 0,
      energyDrinks: eatingHabits.energyDrinks || 0
    },
    physicalActivity: {
      ptFrequency: physicalActivity.ptFrequency || 0,
      ptDuration: physicalActivity.ptDuration || 0,
      participation: physicalActivity.participation || false,
      indoorGames: typeof physicalActivity.indoorGames === 'object' ? physicalActivity.indoorGames : { days: 0, minutes: '0' },
      outdoorGames: typeof physicalActivity.outdoorGames === 'object' ? physicalActivity.outdoorGames : { days: 0, minutes: '0' },
      yoga: typeof physicalActivity.yoga === 'object' ? physicalActivity.yoga : { days: 0, minutes: '0' },
      cycling: typeof physicalActivity.cycling === 'object' ? physicalActivity.cycling : { days: 0, minutes: '0' },
      walking: typeof physicalActivity.walking === 'object' ? physicalActivity.walking : { days: 0, minutes: '0' },
      playAfterSchool: typeof physicalActivity.playAfterSchool === 'object' ? physicalActivity.playAfterSchool : { days: 0, minutes: '0' }
    },
    sedentaryBehavior: {
      tvTime: sedentaryBehavior.tvTime || 0,
      mobileTime: sedentaryBehavior.mobileTime || 0,
      computerTime: sedentaryBehavior.computerTime || 0,
      schoolReading: sedentaryBehavior.schoolReading || 0,
      nonSchoolReading: sedentaryBehavior.nonSchoolReading || 0,
      homeworkTime: sedentaryBehavior.homeworkTime || 0,
      gamingTime: sedentaryBehavior.gamingTime || 0
    },
    sleepQuality: {
      bedtime: sleepQuality.bedtime || '00:00',
      wakeupTime: sleepQuality.wakeupTime || '00:00',
      sleepDuration: sleepQuality.sleepDuration || 0,
      difficultyFallingAsleep: sleepQuality.difficultyFallingAsleep || 0,
      wakeUpDuringSleep: sleepQuality.wakeUpDuringSleep || 0,
      difficultyGettingBackToSleep: sleepQuality.difficultyGettingBackToSleep || 0,
      sleepinessInClasses: sleepQuality.sleepinessInClasses || 0,
      sleepHeadache: sleepQuality.sleepHeadache || 0
    },
    mentalHealth: {
      bodyPerception: mentalHealth.bodyPerception || 0,
      bullyingExperience: mentalHealth.bullyingExperience || false,
      weightGoal: mentalHealth.weightGoal || 'none',
      currentBodyImageSatisfaction: mentalHealth.currentBodyImageSatisfaction || 0,
      desiredBodyImageSatisfaction: mentalHealth.desiredBodyImageSatisfaction || 0,
      difficultyAttention: mentalHealth.difficultyAttention || 0,
      forgetThings: mentalHealth.forgetThings || 0,
      feelLonely: mentalHealth.feelLonely || 0,
      troubleKeepingUp: mentalHealth.troubleKeepingUp || 0
    }
  };

  // Log the exact data being sent to AI
  console.log('Data being sent to AI for analysis:', JSON.stringify(healthData, null, 2));

  return healthData;
};

export const generateObesityPrediction = async (assessmentData: AssessmentData): Promise<AIPrediction> => {
  try {
    // Format the data for AI consumption
    const formattedData = formatAssessmentData(assessmentData);

    const prompt = `
You are a pediatric obesity risk prediction expert trained using WHO, CDC, AAP, APA, and NSF guidelines.

Your task is to assess the obesity risk of a student based on the comprehensive health data provided below. You must simulate the logic and reasoning of a professional doctor analyzing a student case in a school-based pediatric obesity screening.

Return only the following structured JSON format:
{
  "riskLevel": "Low | Medium | High",
  "riskPercentage": number (0–100),
  "confidenceScore": number (0–100),
  "explanation": "One-paragraph clinical-style summary explaining the risk level and contributing health patterns.",
  "keyRiskFactors": ["3 to 5 primary contributors to obesity risk"],
  "recommendations": ["3 to 5 specific, age-appropriate, and actionable tips"]
}

💡 Clinical Guidelines to Follow:
- Use WHO BMI-for-age percentile growth charts (don't use fixed adult BMI ranges)
- Physical activity should follow WHO's 60 min/day guideline for youth
- Screen time must follow AAP's <2 hrs/day recreational recommendation
- Sleep should follow National Sleep Foundation guidelines: 8–10 hrs/night
- Evaluate emotional and mental factors per APA guidelines
- Family history (obesity, diabetes, hypertension) increases risk
- If data is incomplete, make conservative assumptions and mention it in confidenceScore

❌ Do NOT include:
- Any section outside of the above JSON keys
- Any direct calculation like BMI score, total score, or interpretation labels from the user side
- Any unnecessary clinical jargon

🎯 Base your entire reasoning and result generation strictly on the structured data below:

STUDENT HEALTH DATA:
${JSON.stringify(formattedData, null, 2)}
`;

    // Call Gemini model
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Parse the returned JSON
    const parsed = JSON.parse(responseText) as AIPrediction;

    // Validate the response
    if (!isValidPrediction(parsed)) {
      throw new Error('Invalid prediction format received from AI');
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Prediction Failed:", error);
    return getFallbackPrediction();
  }
};

// Helper function to validate the AI prediction
const isValidPrediction = (prediction: any): prediction is AIPrediction => {
  return (
    prediction &&
    typeof prediction === 'object' &&
    ['Low', 'Medium', 'High'].includes(prediction.riskLevel) &&
    typeof prediction.riskPercentage === 'number' &&
    prediction.riskPercentage >= 0 &&
    prediction.riskPercentage <= 100 &&
    typeof prediction.confidenceScore === 'number' &&
    prediction.confidenceScore >= 0 &&
    prediction.confidenceScore <= 100 &&
    typeof prediction.explanation === 'string' &&
    Array.isArray(prediction.keyRiskFactors) &&
    prediction.keyRiskFactors.length > 0 &&
    Array.isArray(prediction.recommendations) &&
    prediction.recommendations.length > 0
  );
};

// Fallback prediction in case of errors
const getFallbackPrediction = (): AIPrediction => {
  return {
    riskLevel: "Medium",
    riskPercentage: 50,
    confidenceScore: 50,
    explanation: "Prediction could not be fully processed. Please try again later.",
    keyRiskFactors: ["Insufficient data or AI fallback used"],
    recommendations: [
      "Ensure complete assessment responses",
      "Maintain physical activity",
      "Limit screen time",
      "Follow regular sleep pattern",
      "Consult school counselor if needed"
    ]
  };
}; 