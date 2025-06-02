
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCuwlIJSEvokGQHlYyXhGiUpIZ2wLCI6ew";

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateObesityPrediction = async (assessmentData: any) => {
  // Calculate scores based on the specified logic
  const bmiScore = getBMIScore(assessmentData.bmi);
  const dietScore = getDietScore(assessmentData.eatingHabits);
  const activityScore = getActivityScore(assessmentData.physicalActivity);
  const screenScore = getScreenScore(assessmentData.sedentaryBehavior);
  const sleepScore = getSleepScore(assessmentData.sleepQuality);
  const mentalScore = getMentalHealthScore(assessmentData.mentalHealth);
  
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

  const prompt = `
    As a pediatric health AI specialist, analyze this child's comprehensive health assessment and provide a detailed report following WHO and CDC guidelines.

    Student: ${assessmentData.name}, Age: ${assessmentData.age}, Gender: ${assessmentData.gender}
    BMI: ${assessmentData.bmi} (Score: ${bmiScore}/2)
    
    Assessment Scores:
    - BMI Health: ${bmiScore}/2
    - Nutrition: ${dietScore}/2  
    - Physical Activity: ${activityScore}/2
    - Screen Time Management: ${screenScore}/2
    - Sleep Quality: ${sleepScore}/2
    - Mental Health: ${mentalScore}/2
    Total Health Score: ${totalScore}/12
    
    Risk Level: ${riskLevel} (${riskPercentage}% risk)

    Please provide a comprehensive analysis in this exact markdown format:

    ## 🔎 Obesity Risk: ${riskLevel.toUpperCase()}

    ### 📋 Summary:
    [Provide a 2-3 sentence summary of overall health status, mentioning BMI percentile for age and primary risk factors]

    ### 🩺 Medical Analysis:
    - **BMI**: [Analysis with percentile reference]
    - **Diet**: [Nutritional intake assessment]
    - **Physical Activity**: [Activity level vs CDC recommendations]
    - **Sedentary Behavior**: [Screen time and sitting behavior impact]
    - **Sleep Quality**: [Sleep pattern analysis]
    - **Mental Health**: [Body image and emotional wellness]

    ### 💡 Recommendations:
    - **Diet**: [Specific nutritional guidance]
    - **Activity Plan**: [Physical activity recommendations]
    - **Sleep Hygiene**: [Sleep improvement strategies]
    - **Mental Support**: [Emotional wellness suggestions]

    ### 🧾 Score Breakdown:
    BMI: ${bmiScore}/2 | Diet: ${dietScore}/2 | Activity: ${activityScore}/2 | Sleep: ${sleepScore}/2 | Screen: ${screenScore}/2 | Mental: ${mentalScore}/2
    **Total: ${totalScore}/12**

    ### 🧠 Motivational Message:
    [Provide an encouraging, age-appropriate message that highlights strengths and motivates positive changes]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      riskLevel,
      riskPercentage,
      recommendations: [
        "Maintain regular physical activity for at least 60 minutes daily",
        "Include more fruits and vegetables in daily meals",
        "Limit recreational screen time to less than 2 hours per day",
        "Ensure 8-9 hours of quality sleep each night",
        "Practice positive body image and stress management"
      ],
      explanation: text || `Health assessment completed. ${assessmentData.name} shows ${riskLevel.toLowerCase()} risk level with a total score of ${totalScore}/12. Focus on maintaining healthy lifestyle habits.`,
      strengths: getStrengths(assessmentData, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore }),
      topRecommendations: getTopRecommendations(riskLevel, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore })
    };
  } catch (error) {
    console.error("Error generating prediction:", error);
    return {
      riskLevel,
      riskPercentage,
      recommendations: [
        "Maintain regular physical activity for at least 60 minutes daily",
        "Include more fruits and vegetables in daily meals",
        "Limit recreational screen time to less than 2 hours per day"
      ],
      explanation: `Health assessment completed. Total health score: ${totalScore}/12. Risk level: ${riskLevel}. Continue focusing on healthy lifestyle habits.`,
      strengths: ["Completed comprehensive health assessment"],
      topRecommendations: ["Maintain healthy lifestyle habits", "Regular physical activity", "Balanced nutrition"]
    };
  }
};

// Helper functions for scoring
function getBMIScore(bmi: number): number {
  if (bmi >= 18.5 && bmi < 25) return 2;
  if (bmi >= 17 && bmi < 30) return 1;
  return 0;
}

function getDietScore(eatingHabits: any): number {
  const healthy = (eatingHabits.fruits + eatingHabits.vegetables + eatingHabits.cereals + eatingHabits.pulses) / 4;
  const unhealthy = (eatingHabits.snacks + eatingHabits.sweets + eatingHabits.beverages) / 3;
  const score = Math.max(0, 2 - Math.abs(unhealthy - healthy));
  return Math.min(2, score);
}

function getActivityScore(physicalActivity: any): number {
  const getActivityMinutes = (activity: any): number => {
    if (typeof activity === 'object' && activity?.days && activity?.minutes) {
      return activity.days * activity.minutes;
    }
    return Number(activity) || 0;
  };

  const totalMinutes = getActivityMinutes(physicalActivity.yoga) + 
                      getActivityMinutes(physicalActivity.exercise) + 
                      getActivityMinutes(physicalActivity.outdoorGames);
  
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
  const sleepIssues = ((sleepQuality.difficultyFallingAsleep || 0) + (sleepQuality.wakeUpDuringSleep || 0)) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - Math.abs((mentalHealth.bodyPerception || 3) - 3));
  const bullyingPenalty = mentalHealth.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getStrengths(assessmentData: any, scores: any): string[] {
  const strengths = [];
  
  if (scores.bmiScore >= 1.5) strengths.push("Healthy BMI range");
  if (scores.dietScore >= 1.5) strengths.push("Good nutritional habits");
  if (scores.activityScore >= 1.5) strengths.push("Active lifestyle");
  if (scores.screenScore >= 1.5) strengths.push("Good screen time management");
  if (scores.sleepScore >= 1.5) strengths.push("Quality sleep patterns");
  if (scores.mentalScore >= 1.5) strengths.push("Positive mental health");
  
  return strengths.length > 0 ? strengths.slice(0, 3) : ["Completed health assessment", "Health-conscious behavior"];
}

function getTopRecommendations(riskLevel: string, scores: any): string[] {
  const recommendations = [];
  
  if (scores.activityScore < 1) recommendations.push("Increase daily physical activity to 60 minutes");
  if (scores.dietScore < 1) recommendations.push("Improve nutrition with more fruits and vegetables");
  if (scores.screenScore < 1) recommendations.push("Reduce screen time to less than 2 hours daily");
  if (scores.sleepScore < 1) recommendations.push("Establish better sleep routine and hygiene");
  
  // Add general recommendations based on risk level
  if (riskLevel === 'High') {
    recommendations.unshift("Consult healthcare provider for comprehensive evaluation");
  }
  
  return recommendations.slice(0, 3);
}
