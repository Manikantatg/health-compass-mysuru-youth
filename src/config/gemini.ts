
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCuwlIJSEvokGQHlYyXhGiUpIZ2wLCI6ew";

const genAI = new GoogleGenerativeAI(API_KEY);

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

    // Simplified and more focused prompt
    const prompt = `
You are a pediatric health specialist. Analyze this child's health assessment and provide a detailed report in ENGLISH language only.

STUDENT INFO:
Name: ${assessmentData.name || 'Student'}
Age: ${assessmentData.age || 'N/A'} years
Gender: ${assessmentData.gender || 'N/A'}
BMI: ${assessmentData.bmi || 0} kg/m²

Obesity ScoreS:
- BMI Health: ${bmiScore}/2
- Nutrition: ${dietScore}/2
- Physical Activity: ${activityScore}/2
- Screen Time: ${screenScore}/2
- Sleep Quality: ${sleepScore}/2
- Mental Health: ${mentalScore}/2
TOTAL: ${totalScore}/12

RISK ASSESSMENT: ${riskLevel} Risk (${riskPercentage}%)

Please provide your analysis in this EXACT format:

## 🔎 Obesity Risk: ${riskLevel.toUpperCase()}

### 📋 Summary:
[2-3 sentences about Obesity Risk Level status and main concerns]

### 🩺 Medical Analysis:
- **BMI**: [Brief BMI analysis]
- **Diet**: [Nutrition assessment]
- **Physical Activity**: [Activity level review]
- **Screen Time**: [Sedentary behavior impact]
- **Sleep Quality**: [Sleep pattern analysis]
- **Mental Health**: [Emotional wellness review]

### 💡 Recommendations:
- **Diet**: [Specific nutrition advice]
- **Activity**: [Physical activity suggestions]
- **Sleep**: [Sleep improvement tips]
- **Mental Health**: [Emotional support suggestions]

### 🧾 Score Breakdown:
BMI: ${bmiScore}/2 | Diet: ${dietScore}/2 | Activity: ${activityScore}/2 | Sleep: ${sleepScore}/2 | Screen: ${screenScore}/2 | Mental: ${mentalScore}/2
**Total: ${totalScore}/12**

### 🧠 Motivational Message:
[Encouraging message for the child focusing on positive aspects and motivation]

IMPORTANT: Respond ONLY in English language. Keep each section concise and child-friendly.
    `;

    console.log("Sending prompt to Gemini API...");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini API response received:", text ? "Success" : "Empty response");

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from AI");
    }
    
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
      explanation: text,
      strengths: getStrengths(assessmentData, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore }),
      topRecommendations: getTopRecommendations(riskLevel, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore })
    };
  } catch (error) {
    console.error("Error generating AI prediction:", error);
    
    // Calculate fallback values
    const bmiScore = getBMIScore(assessmentData.bmi || 0);
    const dietScore = getDietScore(assessmentData.eatingHabits || {});
    const activityScore = getActivityScore(assessmentData.physicalActivity || {});
    const screenScore = getScreenScore(assessmentData.sedentaryBehavior || {});
    const sleepScore = getSleepScore(assessmentData.sleepQuality || {});
    const mentalScore = getMentalHealthScore(assessmentData.mentalHealth || {});
    const totalScore = bmiScore + dietScore + activityScore + screenScore + sleepScore + mentalScore;
    
    let riskLevel: 'Low' | 'Medium' | 'High';
    let riskPercentage: number;
    
    if (totalScore >= 9) {
      riskLevel = 'Low';
      riskPercentage = Math.round(15 + (totalScore - 9) * 5);
    } else if (totalScore >= 5) {
      riskLevel = 'Medium';
      riskPercentage = Math.round(35 + (totalScore - 5) * 10);
    } else {
      riskLevel = 'High';
      riskPercentage = Math.round(75 + totalScore * 5);
    }

    // Fallback detailed analysis
    const fallbackAnalysis = `
## 🔎 Obesity Risk: ${riskLevel.toUpperCase()}

### 📋 Summary:
Based on comprehensive health assessment, ${assessmentData.name || 'the student'} shows ${riskLevel.toLowerCase()} risk for obesity-related health concerns. The assessment considers BMI of ${assessmentData.bmi || 0} kg/m² along with lifestyle factors including physical activity, nutrition habits, sleep patterns, and mental wellness.

### 🩺 Medical Analysis:
- **BMI**: ${getBMIAnalysis(assessmentData.bmi || 0)}
- **Diet**: ${getDietAnalysis(dietScore)}
- **Physical Activity**: ${getActivityAnalysis(activityScore)}
- **Screen Time**: ${getScreenAnalysis(screenScore)}
- **Sleep Quality**: ${getSleepAnalysis(sleepScore)}
- **Mental Health**: ${getMentalAnalysis(mentalScore)}

### 💡 Recommendations:
- **Diet**: Include more fruits, vegetables, and whole grains while reducing processed snacks and sugary drinks
- **Activity**: Aim for at least 60 minutes of physical activity daily through sports, games, or active play
- **Sleep**: Maintain consistent bedtime routine and aim for 8-9 hours of quality sleep each night
- **Mental Health**: Practice positive self-image and seek support when feeling stressed or overwhelmed

### 🧾 Score Breakdown:
BMI: ${bmiScore}/2 | Diet: ${dietScore}/2 | Activity: ${activityScore}/2 | Sleep: ${sleepScore}/2 | Screen: ${screenScore}/2 | Mental: ${mentalScore}/2
**Total: ${totalScore}/12**

### 🧠 Motivational Message:
Great job on completing your health assessment! Every step towards better health counts. Remember that small changes can make a big difference. Keep up the excellent work and continue focusing on healthy habits that make you feel strong and happy!
    `;

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
      explanation: fallbackAnalysis,
      strengths: getStrengths(assessmentData, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore }),
      topRecommendations: getTopRecommendations(riskLevel, { bmiScore, dietScore, activityScore, screenScore, sleepScore, mentalScore })
    };
  }
};

// Helper functions for scoring with proper null checks
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
      return activity.days * activity.minutes;
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

// Helper functions for fallback analysis
function getBMIAnalysis(bmi: number): string {
  if (bmi < 18.5) return "Below normal weight range - consider nutritional consultation";
  if (bmi < 25) return "Within healthy weight range for age - excellent!";
  if (bmi < 30) return "Above normal weight range - focus on healthy lifestyle changes";
  return "Significantly above normal range - medical consultation recommended";
}

function getDietAnalysis(score: number): string {
  if (score >= 1.5) return "Excellent nutritional habits with good balance of healthy foods";
  if (score >= 1) return "Good nutrition with some room for improvement in food choices";
  return "Significant improvement needed in dietary habits and food choices";
}

function getActivityAnalysis(score: number): string {
  if (score >= 1.5) return "Excellent activity level meeting recommended guidelines";
  if (score >= 1) return "Moderate activity level - consider increasing frequency";
  return "Below recommended activity levels - increase physical activity significantly";
}

function getScreenAnalysis(score: number): string {
  if (score >= 1.5) return "Excellent screen time management within healthy limits";
  if (score >= 1) return "Moderate screen time - monitor and consider reducing";
  return "Excessive screen time - significant reduction needed for better health";
}

function getSleepAnalysis(score: number): string {
  if (score >= 1.5) return "Good sleep quality and patterns supporting healthy development";
  if (score >= 1) return "Fair sleep quality with some issues that could be improved";
  return "Poor sleep quality requiring attention and improvement strategies";
}

function getMentalAnalysis(score: number): string {
  if (score >= 1.5) return "Positive mental health and body image supporting overall wellness";
  if (score >= 1) return "Generally good mental health with some areas for support";
  return "Mental health concerns that may benefit from counseling or support";
}
