
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCuwlIJSEvokGQHlYyXhGiUpIZ2wLCI6ew";

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateObesityPrediction = async (assessmentData: any) => {
  const prompt = `
    As a healthcare AI, analyze the following child's health assessment data and provide an obesity risk prediction:
    
    Demographics: Age ${assessmentData.age}, Gender: ${assessmentData.gender}, BMI: ${assessmentData.bmi}
    Physical Activity Score: ${assessmentData.physicalActivityScore}/10
    Eating Habits Score: ${assessmentData.eatingHabitsScore}/10
    Sedentary Behavior Score: ${assessmentData.sedentaryScore}/10
    Mental Health Score: ${assessmentData.mentalHealthScore}/10
    Sleep Quality Score: ${assessmentData.sleepScore}/10
    Family History: ${assessmentData.familyHistory ? 'Yes' : 'No'}
    
    Please provide:
    1. Risk Level (Low/Medium/High)
    2. Risk Percentage (0-100%)
    3. Three specific recommendations
    4. Brief explanation of the assessment
    
    Format your response as JSON:
    {
      "riskLevel": "Low|Medium|High",
      "riskPercentage": number,
      "recommendations": ["rec1", "rec2", "rec3"],
      "explanation": "brief explanation"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      riskLevel: "Medium",
      riskPercentage: 50,
      recommendations: [
        "Increase physical activity to at least 60 minutes daily",
        "Reduce screen time and sedentary activities",
        "Maintain a balanced diet with more fruits and vegetables"
      ],
      explanation: "Assessment completed. Please consult with a healthcare professional for detailed guidance."
    };
  } catch (error) {
    console.error("Error generating prediction:", error);
    return {
      riskLevel: "Medium",
      riskPercentage: 50,
      recommendations: [
        "Increase physical activity",
        "Maintain healthy eating habits",
        "Ensure adequate sleep"
      ],
      explanation: "Unable to generate detailed analysis. Please try again later."
    };
  }
};
