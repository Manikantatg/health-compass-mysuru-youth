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
  const { student, responses } = data;
  
  // Extract and structure all relevant health assessment data
  const healthData = {
    socioDemographic: {
      name: student.name,
      age: student.age,
      gender: student.gender,
      height: student.height,
      weight: student.weight,
      schoolName: student.schoolName,
      class: student.class,
      section: student.section,
      birthOrder: student.birthOrder,
      brothers: student.brothers,
      sisters: student.sisters,
      familyType: student.familyType,
      hostelResident: student.hostelResident,
      familyObesity: responses.familyHistory?.obesity || 'Not reported',
      familyDiabetes: responses.familyHistory?.diabetes || 'Not reported',
      familyHypertension: responses.familyHistory?.hypertension || 'Not reported'
    },
    eatingHabits: {
      fruits: responses.nutrition?.fruits || 0,
      vegetables: responses.nutrition?.vegetables || 0,
      cereals: responses.nutrition?.cereals || 0,
      pulses: responses.nutrition?.pulses || 0,
      milkProducts: responses.nutrition?.milkProducts || 0,
      nonVegConsumption: responses.nutrition?.nonVegConsumption || 0,
      snacks: responses.nutrition?.snacks || 0,
      beverages: responses.nutrition?.beverages || 0,
      sweets: responses.nutrition?.sweets || 0,
      junkFood: responses.nutrition?.junkFood || 0,
      softDrinks: responses.nutrition?.softDrinks || 0,
      energyDrinks: responses.nutrition?.energyDrinks || 0
    },
    physicalActivity: {
      ptFrequency: responses.physicalActivity?.ptFrequency || 0,
      ptDuration: responses.physicalActivity?.ptDuration || 0,
      participation: responses.physicalActivity?.participation || false,
      indoorGames: {
        days: responses.physicalActivity?.indoorGames?.days || 0,
        minutes: responses.physicalActivity?.indoorGames?.minutes || '0'
      },
      outdoorGames: {
        days: responses.physicalActivity?.outdoorGames?.days || 0,
        minutes: responses.physicalActivity?.outdoorGames?.minutes || '0'
      },
      yoga: {
        days: responses.physicalActivity?.yoga?.days || 0,
        minutes: responses.physicalActivity?.yoga?.minutes || '0'
      },
      cycling: {
        days: responses.physicalActivity?.cycling?.days || 0,
        minutes: responses.physicalActivity?.cycling?.minutes || '0'
      },
      walking: {
        days: responses.physicalActivity?.walking?.days || 0,
        minutes: responses.physicalActivity?.walking?.minutes || '0'
      },
      playAfterSchool: {
        days: responses.physicalActivity?.playAfterSchool?.days || 0,
        minutes: responses.physicalActivity?.playAfterSchool?.minutes || '0'
      }
    },
    sedentaryBehavior: {
      tvTime: responses.sedentaryBehavior?.tvTime || 0,
      mobileTime: responses.sedentaryBehavior?.mobileTime || 0,
      computerTime: responses.sedentaryBehavior?.computerTime || 0,
      schoolReading: responses.sedentaryBehavior?.schoolReading || 0,
      nonSchoolReading: responses.sedentaryBehavior?.nonSchoolReading || 0,
      homeworkTime: responses.sedentaryBehavior?.homeworkTime || 0,
      gamingTime: responses.sedentaryBehavior?.gamingTime || 0
    },
    sleepQuality: {
      bedtime: responses.sleep?.bedtime || '00:00',
      wakeupTime: responses.sleep?.wakeupTime || '00:00',
      sleepDuration: responses.sleep?.sleepDuration || 0,
      difficultyFallingAsleep: responses.sleep?.difficultyFallingAsleep || 0,
      wakeUpDuringSleep: responses.sleep?.wakeUpDuringSleep || 0,
      difficultyGettingBackToSleep: responses.sleep?.difficultyGettingBackToSleep || 0,
      sleepinessInClasses: responses.sleep?.sleepinessInClasses || 0,
      sleepHeadache: responses.sleep?.sleepHeadache || 0
    },
    mentalHealth: {
      bodyPerception: responses.mentalHealth?.bodyPerception || 0,
      bullyingExperience: responses.mentalHealth?.bullyingExperience || false,
      weightGoal: responses.mentalHealth?.weightGoal || 'Not reported',
      currentBodyImageSatisfaction: responses.mentalHealth?.currentBodyImageSatisfaction || 0,
      desiredBodyImageSatisfaction: responses.mentalHealth?.desiredBodyImageSatisfaction || 0,
      difficultyAttention: responses.mentalHealth?.difficultyAttention || 0,
      forgetThings: responses.mentalHealth?.forgetThings || 0,
      feelLonely: responses.mentalHealth?.feelLonely || 0,
      troubleKeepingUp: responses.mentalHealth?.troubleKeepingUp || 0
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