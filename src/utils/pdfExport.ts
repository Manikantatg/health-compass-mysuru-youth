
import { AssessmentData } from '../types/assessment';

export const generateHealthReportPDF = async (assessmentData: AssessmentData) => {
  // Import jsPDF dynamically to avoid SSR issues
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
      // Add page number to footer
      const pageNum = doc.getNumberOfPages();
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(10);
      doc.text(`Page ${pageNum}`, pageWidth - 30, pageHeight - 20);
      doc.setTextColor(0, 0, 0);
    }
  };

  // Header with premium branding
  doc.setFillColor(63, 81, 181); // Primary indigo color
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('HealthPredict', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Wellness Report', pageWidth / 2, 35, { align: 'center' });
  
  // Generation timestamp
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-IN', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  doc.setFontSize(11);
  doc.text(`Generated on: ${dateStr} at ${timeStr}`, pageWidth / 2, 48, { align: 'center' });

  currentY = 75;

  // Student Profile Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Student Profile', 20, currentY);
  currentY += 12;

  doc.setFillColor(250, 250, 250);
  doc.rect(15, currentY - 5, pageWidth - 30, 65, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const studentInfo = [
    `Name: ${assessmentData.socioDemographic.name}`,
    `Age: ${assessmentData.socioDemographic.age} years old`,
    `Gender: ${assessmentData.socioDemographic.gender.charAt(0).toUpperCase() + assessmentData.socioDemographic.gender.slice(1)}`,
    `Class: ${assessmentData.socioDemographic.class}-${assessmentData.socioDemographic.section}`,
    `School: ${assessmentData.socioDemographic.schoolName}`,
    `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString('en-IN')}`
  ];

  studentInfo.forEach((info, index) => {
    doc.text(info, 25, currentY + (index * 8));
  });

  currentY += studentInfo.length * 8 + 20;

  // Health Risk Summary
  checkPageBreak(50);
  const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
  const riskColors = {
    'Low': [102, 187, 106],
    'Medium': [255, 160, 0],
    'High': [239, 83, 80]
  };
  const riskColor = riskColors[riskLevel as keyof typeof riskColors];
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Health Risk Summary', 20, currentY);
  currentY += 15;

  // Risk level indicator
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(20, currentY, pageWidth - 40, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Risk Level: ${riskLevel.toUpperCase()} RISK`, pageWidth / 2, currentY + 16, { align: 'center' });

  // Calculate overall health score
  const totalScore = calculateOverallHealthScore(assessmentData);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Overall Health Score: ${totalScore.toFixed(1)} / 12 (${Math.round((totalScore / 12) * 100)}%)`, pageWidth / 2, currentY + 8, { align: 'center' });

  currentY += 35;

  // Health Insights Section
  checkPageBreak(80);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🧠 Health Insights', 20, currentY);
  currentY += 15;

  // BMI Analysis
  const bmiCategory = getBMICategory(assessmentData.bmi);
  const bmiAnalysis = getBMIAnalysis(assessmentData.bmi, bmiCategory);
  
  addHealthInsight(doc, '📌 BMI', `BMI Value: ${assessmentData.bmi.toFixed(1)} – ${bmiCategory}`, bmiAnalysis);

  // Nutrition Analysis
  const nutritionScore = getDietScore(assessmentData.eatingHabits);
  const nutritionAnalysis = getDietAnalysis(nutritionScore);
  addHealthInsight(doc, '🍎 Nutrition', nutritionAnalysis.assessment, nutritionAnalysis.action);

  // Physical Activity Analysis
  const activityScore = getPhysicalActivityScore(assessmentData.physicalActivity);
  const activityAnalysis = getActivityAnalysis(activityScore);
  addHealthInsight(doc, '🏃 Activity', activityAnalysis.assessment, activityAnalysis.action);

  // Screen Time Analysis
  const screenScore = getScreenScore(assessmentData.sedentaryBehavior);
  const screenAnalysis = getScreenTimeAnalysis(screenScore);
  addHealthInsight(doc, '📱 Screen Time', screenAnalysis.assessment, screenAnalysis.action);

  // Sleep Analysis
  const sleepScore = getSleepScore(assessmentData.sleepQuality);
  const sleepAnalysis = getSleepAnalysis(sleepScore);
  addHealthInsight(doc, '😴 Sleep', sleepAnalysis.assessment, sleepAnalysis.action);

  // Mental Health Analysis
  const mentalScore = getMentalHealthScore(assessmentData.mentalHealth);
  const mentalAnalysis = getMentalHealthAnalysis(mentalScore);
  addHealthInsight(doc, '😊 Mental Health', mentalAnalysis.assessment, mentalAnalysis.action);

  // Recommended Actions
  checkPageBreak(60);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('✅ Recommended Actions', 20, currentY);
  currentY += 15;

  const recommendations = assessmentData.aiPrediction?.recommendations || getDefaultRecommendations();
  
  doc.setFillColor(245, 248, 255);
  doc.rect(15, currentY - 5, pageWidth - 30, recommendations.length * 10 + 15, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  recommendations.slice(0, 6).forEach((rec, index) => {
    checkPageBreak(12);
    const bullet = '•';
    const recLines = doc.splitTextToSize(`${bullet} ${rec}`, pageWidth - 50);
    recLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 25, currentY + (lineIndex * 5));
    });
    currentY += recLines.length * 5 + 3;
  });

  currentY += 15;

  // Footer with branding and confidentiality
  const footerY = pageHeight - 35;
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('🔒 Confidential Health Report | For Medical Use Only', 20, footerY);
  doc.text('Powered by HealthPredict AI | www.healthpredict.in', pageWidth - 20, footerY, { align: 'right' });
  doc.text('© 2025 Doutly Technologies | All Rights Reserved', pageWidth / 2, footerY + 8, { align: 'center' });

  // Watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  doc.text('HEALTHPREDICT', pageWidth / 2, pageHeight / 2, { 
    align: 'center',
    angle: 45
  });

  // Generate clean filename
  const cleanName = assessmentData.socioDemographic.name.replace(/[^a-zA-Z0-9]/g, '');
  const dateStr2 = now.toLocaleDateString('en-GB').replace(/\//g, '');
  doc.save(`healthpredict_${cleanName}_${dateStr2}.pdf`);

  // Helper function to add health insights
  function addHealthInsight(doc: any, icon: string, assessment: string, action: string) {
    checkPageBreak(20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(icon, 25, currentY);
    
    doc.setFont('helvetica', 'normal');
    const assessmentLines = doc.splitTextToSize(assessment, pageWidth - 70);
    assessmentLines.forEach((line: string, index: number) => {
      doc.text(line, 35, currentY + (index * 5));
    });
    currentY += assessmentLines.length * 5;
    
    if (action) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const actionLines = doc.splitTextToSize(`Action: ${action}`, pageWidth - 70);
      actionLines.forEach((line: string, index: number) => {
        doc.text(line, 35, currentY + (index * 4));
      });
      currentY += actionLines.length * 4;
    }
    
    doc.setTextColor(0, 0, 0);
    currentY += 8;
  }
};

// Helper functions for analysis
function calculateOverallHealthScore(data: AssessmentData): number {
  const bmiScore = getBMIScore(data.bmi);
  const dietScore = getDietScore(data.eatingHabits);
  const activityScore = getPhysicalActivityScore(data.physicalActivity);
  const screenScore = getScreenScore(data.sedentaryBehavior);
  const sleepScore = getSleepScore(data.sleepQuality);
  const mentalScore = getMentalHealthScore(data.mentalHealth);
  
  return bmiScore + dietScore + activityScore + screenScore + sleepScore + mentalScore;
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function getBMIScore(bmi: number): number {
  if (bmi >= 18.5 && bmi < 25) return 2;
  if (bmi >= 17 && bmi < 30) return 1;
  return 0;
}

function getBMIAnalysis(bmi: number, category: string): string {
  if (category === 'Normal Weight') return 'Healthy weight range maintained.';
  if (category === 'Underweight') return 'Consider consulting a nutritionist for healthy weight gain.';
  if (category === 'Overweight') return 'Moderate lifestyle changes recommended.';
  return 'Consult pediatric advisor for comprehensive weight management.';
}

function getDietScore(eatingHabits: any): number {
  const healthy = (eatingHabits.fruits + eatingHabits.vegetables + eatingHabits.cereals + eatingHabits.pulses) / 4;
  const unhealthy = (eatingHabits.snacks + eatingHabits.sweets + eatingHabits.beverages) / 3;
  return Math.max(0, Math.min(2, 2 - (unhealthy - healthy)));
}

function getDietAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Excellent balance of grains, proteins, fruits, dairy.',
    action: 'Continue current healthy eating patterns.'
  };
  if (score >= 1) return {
    assessment: 'Good nutrition habits with room for improvement.',
    action: 'Increase fruits and vegetables, reduce processed foods.'
  };
  return {
    assessment: 'Dietary habits need significant improvement.',
    action: 'Consult a nutritionist for meal planning guidance.'
  };
}

function getPhysicalActivityScore(physicalActivity: any): number {
  const getActivityMinutes = (activity: any): number => {
    if (typeof activity === 'object' && activity.days && activity.minutes) {
      return activity.days * activity.minutes;
    }
    return Number(activity) || 0;
  };

  const totalMinutes = getActivityMinutes(physicalActivity.yoga) + 
                      getActivityMinutes(physicalActivity.exercise) + 
                      getActivityMinutes(physicalActivity.outdoorGames);
  
  if (totalMinutes >= 420) return 2;
  if (totalMinutes >= 180) return 1;
  return 0;
}

function getActivityAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Meets recommended 60 mins/day.',
    action: 'Maintain current activity levels.'
  };
  if (score >= 1) return {
    assessment: 'Good activity level with room for improvement.',
    action: 'Increase frequency or duration of activities.'
  };
  return {
    assessment: 'Below recommended activity levels.',
    action: 'Engage in physical activity daily (walking, yoga, sports).'
  };
}

function getScreenScore(sedentaryBehavior: any): number {
  const totalScreenTime = sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime;
  if (totalScreenTime <= 1) return 2;
  if (totalScreenTime <= 2) return 1;
  return 0;
}

function getScreenTimeAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Excellent screen time management within healthy limits.',
    action: 'Continue current screen time habits.'
  };
  if (score >= 1) return {
    assessment: 'Moderate screen time within acceptable range.',
    action: 'Consider reducing by 30 minutes daily.'
  };
  return {
    assessment: 'Excessive (>5 hrs/day) screen time.',
    action: 'Reduce to under 2 hrs gradually, replace with physical activities.'
  };
}

function getSleepScore(sleepQuality: any): number {
  const sleepIssues = (sleepQuality.difficultyFallingAsleep + sleepQuality.wakeUpDuringSleep) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getSleepAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Excellent sleep quality supporting optimal development.',
    action: 'Maintain current sleep schedule.'
  };
  if (score >= 1) return {
    assessment: 'Good sleep quality with minor issues.',
    action: 'Follow consistent bedtime routine.'
  };
  return {
    assessment: 'Poor sleep reported.',
    action: 'Improve bedtime hygiene, seek guidance if persistent.'
  };
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - (mentalHealth.bodyPerception - 1));
  const bullyingPenalty = mentalHealth.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getMentalHealthAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Positive mental health and healthy body image.',
    action: 'Continue building self-confidence and social connections.'
  };
  if (score >= 1) return {
    assessment: 'Generally good mental health with some areas for support.',
    action: 'Practice mindfulness and maintain positive relationships.'
  };
  return {
    assessment: 'Emotional stress signs identified.',
    action: 'Seek guidance/counseling support, talk to trusted adults.'
  };
}

function getDefaultRecommendations(): string[] {
  return [
    'Engage in physical activity daily (e.g., walking, yoga, sports)',
    'Increase fruit and vegetable servings to 5-7 daily',
    'Follow a consistent sleep schedule (8–10 hrs/night)',
    'Reduce screen time gradually to under 2 hours daily',
    'Consider mindfulness or talk therapy for emotional wellness',
    'Stay hydrated with 6-8 glasses of water daily',
    'Schedule regular health check-ups and follow medical advice'
  ];
}
