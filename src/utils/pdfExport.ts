
import { AssessmentData } from '../types/assessment';

export const generateHealthReportPDF = async (assessmentData: AssessmentData) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Helper function to add text with proper spacing
    const addText = (text: string, x: number, y: number, options?: any) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(text, x, y, options);
      return y;
    };

    // Header - Blue
    doc.setTextColor(0, 102, 204); // Blue
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    currentY = addText('HealthPredict', pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
    
    doc.setFontSize(16);
    currentY = addText('Student Wellness Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    
    // Generation timestamp - Blue
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    currentY = addText(`Report Generated: ${dateStr}, ${timeStr}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Student Information Section - Blue headers
    doc.setTextColor(0, 102, 204); // Blue
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Student Information', 20, currentY);
    currentY += 8;

    doc.setTextColor(0, 0, 0); // Black for content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const studentInfo = [
      `Name: ${assessmentData.socioDemographic.name || 'N/A'}`,
      `Age: ${assessmentData.socioDemographic.age || 'N/A'} years`,
      `Gender: ${(assessmentData.socioDemographic.gender || 'N/A').charAt(0).toUpperCase() + (assessmentData.socioDemographic.gender || '').slice(1)}`,
      `Class: ${assessmentData.socioDemographic.class || 'N/A'}-${assessmentData.socioDemographic.section || 'N/A'}`,
      `School: ${assessmentData.socioDemographic.schoolName || 'N/A'}`,
      `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString('en-GB') || 'N/A'}`
    ];

    studentInfo.forEach((info) => {
      currentY = addText(info, 20, currentY);
      currentY += 4;
    });
    currentY += 10;

    // Add separator line
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Health Risk Summary - Red
    const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
    doc.setTextColor(220, 53, 69); // Red
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Health Risk Summary', 20, currentY);
    currentY += 8;

    doc.setFontSize(12);
    currentY = addText(`Overall Risk Level: ${riskLevel.toUpperCase()} RISK`, 20, currentY);
    currentY += 15;

    // Add separator line
    doc.setTextColor(0, 0, 0);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Clinical Findings and Recommendations - Blue header
    doc.setTextColor(0, 102, 204); // Blue
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Clinical Findings and Recommendations', 20, currentY);
    currentY += 10;

    // Helper function to add clinical findings
    const addClinicalFinding = (title: string, observation: string, recommendation: string) => {
      // Title in Red
      doc.setTextColor(220, 53, 69); // Red
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      currentY = addText(title, 20, currentY);
      currentY += 5;
      
      // Observation in Black
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      currentY = addText(`Observation: ${observation}`, 25, currentY);
      currentY += 4;
      
      // Recommendation in Black
      currentY = addText(`Recommendation: ${recommendation}`, 25, currentY);
      currentY += 8;
    };

    // BMI Analysis
    const bmiCategory = getBMICategory(assessmentData.bmi || 0);
    const bmiRecommendation = getBMIRecommendation(bmiCategory);
    addClinicalFinding(
      `1. Body Mass Index (BMI):`,
      `BMI Value: ${(assessmentData.bmi || 0).toFixed(1)} (${bmiCategory})`,
      bmiRecommendation
    );

    // Nutrition Analysis
    const nutritionScore = getDietScore(assessmentData.eatingHabits);
    const nutritionAnalysis = getDietAnalysis(nutritionScore);
    addClinicalFinding(
      `2. Nutrition:`,
      nutritionAnalysis.observation,
      nutritionAnalysis.recommendation
    );

    // Physical Activity Analysis
    const activityScore = getPhysicalActivityScore(assessmentData.physicalActivity);
    const activityAnalysis = getActivityAnalysis(activityScore);
    addClinicalFinding(
      `3. Physical Activity:`,
      activityAnalysis.observation,
      activityAnalysis.recommendation
    );

    // Screen Time Analysis
    const screenScore = getScreenScore(assessmentData.sedentaryBehavior);
    const screenAnalysis = getScreenTimeAnalysis(screenScore);
    addClinicalFinding(
      `4. Screen Time:`,
      screenAnalysis.observation,
      screenAnalysis.recommendation
    );

    // Sleep Analysis
    const sleepScore = getSleepScore(assessmentData.sleepQuality);
    const sleepAnalysis = getSleepAnalysis(sleepScore);
    addClinicalFinding(
      `5. Sleep:`,
      sleepAnalysis.observation,
      sleepAnalysis.recommendation
    );

    // Mental Health Analysis
    const mentalScore = getMentalHealthScore(assessmentData.mentalHealth);
    const mentalAnalysis = getMentalHealthAnalysis(mentalScore);
    addClinicalFinding(
      `6. Mental Health:`,
      mentalAnalysis.observation,
      mentalAnalysis.recommendation
    );

    // Add separator line
    doc.setTextColor(0, 0, 0);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Summary of Recommendations - Green
    doc.setTextColor(40, 167, 69); // Green
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Summary of Recommendations', 20, currentY);
    currentY += 8;

    const recommendations = [
      'Maintain regular physical activity for at least 60 minutes daily',
      'Include more fruits and vegetables in daily meals',
      'Limit recreational screen time to less than 2 hours per day',
      'Ensure 8-9 hours of quality sleep each night',
      'Practice positive body image and stress management'
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    recommendations.forEach((rec) => {
      currentY = addText(`• ${rec}`, 20, currentY);
      currentY += 4;
    });
    currentY += 10;

    // Add separator line
    doc.setTextColor(0, 0, 0);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Footer - Blue
    doc.setTextColor(0, 102, 204); // Blue
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Confidential Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    
    doc.setFont('helvetica', 'normal');
    currentY = addText('This report is intended for medical professionals, educators, and guardians', pageWidth / 2, currentY, { align: 'center' });
    currentY += 3;
    currentY = addText('to support student health and wellness.', pageWidth / 2, currentY, { align: 'center' });

    // Generate clean filename
    const cleanName = (assessmentData.socioDemographic.name || 'student').replace(/[^a-zA-Z0-9]/g, '');
    const dateStr2 = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    const filename = `HealthPredict_${cleanName}_${dateStr2}.pdf`;
    
    // Save the PDF
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
};

// Helper functions for analysis
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function getBMIRecommendation(category: string): string {
  if (category === 'Normal Weight') return 'Continue maintaining healthy weight through balanced diet and regular exercise.';
  if (category === 'Underweight') return 'Consult a nutritionist for healthy weight gain strategies.';
  if (category === 'Overweight') return 'Implement moderate lifestyle changes focusing on diet and exercise.';
  return 'Consult a pediatric healthcare provider for a comprehensive weight management plan.';
}

function getDietScore(eatingHabits: any): number {
  const healthy = ((eatingHabits?.fruits || 0) + (eatingHabits?.vegetables || 0) + (eatingHabits?.cereals || 0) + (eatingHabits?.pulses || 0)) / 4;
  const unhealthy = ((eatingHabits?.snacks || 0) + (eatingHabits?.sweets || 0) + (eatingHabits?.beverages || 0)) / 3;
  return Math.max(0, Math.min(2, 2 - (unhealthy - healthy)));
}

function getDietAnalysis(score: number) {
  if (score >= 1.5) return {
    observation: 'Excellent nutritional balance maintained.',
    recommendation: 'Continue current healthy eating patterns with focus on variety and portion control.'
  };
  if (score >= 1) return {
    observation: 'Good nutrition habits with room for improvement.',
    recommendation: 'Increase fruits and vegetables intake, reduce processed foods consumption.'
  };
  return {
    observation: 'Dietary habits need significant improvement.',
    recommendation: 'Refer to a nutritionist for personalized meal planning focusing on fruits, vegetables, and whole grains.'
  };
}

function getPhysicalActivityScore(physicalActivity: any): number {
  const getActivityMinutes = (activity: any): number => {
    if (typeof activity === 'object' && activity?.days && activity?.minutes) {
      return activity.days * activity.minutes;
    }
    return Number(activity) || 0;
  };

  const totalMinutes = getActivityMinutes(physicalActivity?.yoga) + 
                      getActivityMinutes(physicalActivity?.exercise) + 
                      getActivityMinutes(physicalActivity?.outdoorGames);
  
  if (totalMinutes >= 420) return 2;
  if (totalMinutes >= 180) return 1;
  return 0;
}

function getActivityAnalysis(score: number) {
  if (score >= 1.5) return {
    observation: 'Meets recommended 60 minutes of daily physical activity.',
    recommendation: 'Maintain current activity levels with variety in exercise types.'
  };
  if (score >= 1) return {
    observation: 'Good activity level with room for improvement.',
    recommendation: 'Increase frequency or duration of physical activities to meet daily recommendations.'
  };
  return {
    observation: 'Below recommended activity levels.',
    recommendation: 'Engage in at least 60 minutes of daily physical activity such as sports, walking, or yoga.'
  };
}

function getScreenScore(sedentaryBehavior: any): number {
  const totalScreenTime = (sedentaryBehavior?.tvTime || 0) + (sedentaryBehavior?.mobileTime || 0);
  if (totalScreenTime <= 1) return 2;
  if (totalScreenTime <= 2) return 1;
  return 0;
}

function getScreenTimeAnalysis(score: number) {
  if (score >= 1.5) return {
    observation: 'Screen time within healthy limits.',
    recommendation: 'Continue current screen time management practices.'
  };
  if (score >= 1) return {
    observation: 'Moderate screen time within acceptable range.',
    recommendation: 'Consider reducing recreational screen time by 30 minutes daily.'
  };
  return {
    observation: 'Excessive recreational screen time (>5 hours/day).',
    recommendation: 'Gradually reduce screen time to under 2 hours per day, replacing it with physical activities.'
  };
}

function getSleepScore(sleepQuality: any): number {
  const sleepIssues = ((sleepQuality?.difficultyFallingAsleep || 0) + (sleepQuality?.wakeUpDuringSleep || 0)) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getSleepAnalysis(score: number) {
  if (score >= 1.5) return {
    observation: 'Excellent sleep quality supporting optimal development.',
    recommendation: 'Maintain current sleep schedule and bedtime routines.'
  };
  if (score >= 1) return {
    observation: 'Good sleep quality with minor issues.',
    recommendation: 'Follow consistent bedtime routine aiming for 8-9 hours of quality sleep.'
  };
  return {
    observation: 'Poor sleep quality reported.',
    recommendation: 'Maintain consistent bedtime routines aiming for 8-9 hours of quality sleep. Seek guidance if problems persist.'
  };
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - Math.abs((mentalHealth?.bodyPerception || 3) - 3));
  const bullyingPenalty = mentalHealth?.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getMentalHealthAnalysis(score: number) {
  if (score >= 1.5) return {
    observation: 'Positive mental health and healthy body image.',
    recommendation: 'Continue building self-confidence and maintaining positive social connections.'
  };
  if (score >= 1) return {
    observation: 'Generally good mental health with some areas for support.',
    recommendation: 'Practice mindfulness techniques and maintain positive relationships with peers and family.'
  };
  return {
    observation: 'Emotional stress signs identified.',
    recommendation: 'Seek counseling or support. Talk to trusted adults.'
  };
}
