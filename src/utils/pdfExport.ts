
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
    }
  };

  // Header with professional styling
  doc.setFillColor(63, 81, 181); // Primary color
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('🩺 HealthPredict Report', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Comprehensive Health Assessment & Wellness Analysis', pageWidth / 2, 38, { align: 'center' });

  currentY = 65;

  // Patient Information Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 Student Information', 20, currentY);
  currentY += 15;

  doc.setFillColor(248, 249, 250); // Light background
  doc.rect(15, currentY - 5, pageWidth - 30, 70, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const studentInfo = [
    `Name: ${assessmentData.socioDemographic.name}`,
    `Age: ${assessmentData.socioDemographic.age} years old`,
    `Gender: ${assessmentData.socioDemographic.gender}`,
    `Class: ${assessmentData.socioDemographic.class}-${assessmentData.socioDemographic.section}`,
    `School: ${assessmentData.socioDemographic.schoolName}`,
    `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString('en-IN')}`,
    `Report Generated: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`
  ];

  studentInfo.forEach((info, index) => {
    doc.text(info, 25, currentY + (index * 8));
  });

  currentY += studentInfo.length * 8 + 20;

  // Risk Assessment Section
  checkPageBreak(40);
  const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
  const riskColor = riskLevel === 'Low' ? [34, 197, 94] : riskLevel === 'High' ? [239, 68, 68] : [245, 158, 11];
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 Health Risk Assessment', 20, currentY);
  currentY += 15;

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(20, currentY, pageWidth - 40, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Risk Level: ${riskLevel.toUpperCase()}`, pageWidth / 2, currentY + 20, { align: 'center' });

  currentY += 40;

  // Health Metrics Section
  checkPageBreak(80);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Health Metrics Analysis', 20, currentY);
  currentY += 15;

  const bmiCategory = getBMICategory(assessmentData.bmi);
  const metrics = [
    { label: '💪 BMI Analysis', value: `${assessmentData.bmi.toFixed(1)} kg/m² (${bmiCategory})`, score: getBMIScore(assessmentData.bmi) },
    { label: '🥗 Nutrition Score', value: getDietAssessment(getDietScore(assessmentData.eatingHabits)), score: getDietScore(assessmentData.eatingHabits) },
    { label: '🏃 Physical Activity', value: getPhysicalActivityAssessment(assessmentData.physicalActivity), score: getPhysicalActivityScore(assessmentData.physicalActivity) },
    { label: '📱 Screen Time', value: getScreenTimeAssessment(assessmentData.sedentaryBehavior), score: getScreenScore(assessmentData.sedentaryBehavior) },
    { label: '😴 Sleep Quality', value: getSleepAssessment(assessmentData.sleepQuality), score: getSleepScore(assessmentData.sleepQuality) },
    { label: '🧠 Mental Health', value: getMentalHealthAssessment(assessmentData.mentalHealth), score: getMentalHealthScore(assessmentData.mentalHealth) }
  ];

  metrics.forEach((metric, index) => {
    checkPageBreak(25);
    
    // Metric header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.label, 25, currentY);
    
    // Score bar
    const barWidth = 60;
    const barHeight = 8;
    const scorePercentage = (metric.score / 2) * 100;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(pageWidth - 90, currentY - 6, barWidth, barHeight, 'F');
    
    const scoreColor = scorePercentage >= 75 ? [34, 197, 94] : scorePercentage >= 50 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(pageWidth - 90, currentY - 6, (scorePercentage / 100) * barWidth, barHeight, 'F');
    
    currentY += 8;
    
    // Metric description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const description = doc.splitTextToSize(metric.value, pageWidth - 50);
    description.forEach((line: string, lineIndex: number) => {
      doc.text(line, 30, currentY + (lineIndex * 5));
    });
    
    currentY += description.length * 5 + 8;
  });

  // Recommendations Section
  checkPageBreak(40);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 Personalized Recommendations', 20, currentY);
  currentY += 15;

  const recommendations = assessmentData.aiPrediction?.recommendations || [
    'Engage in at least 60 minutes of physical activity daily, including sports, walking, or active play',
    'Include 5-7 servings of fruits and vegetables in your daily diet for optimal nutrition',
    'Limit recreational screen time to maximum 2 hours per day to support better sleep and focus',
    'Maintain consistent sleep schedule with 8-9 hours of quality sleep each night',
    'Practice stress management techniques and maintain positive social connections',
    'Stay hydrated by drinking 6-8 glasses of water throughout the day',
    'Schedule regular health check-ups and follow up on any concerning symptoms'
  ];

  doc.setFillColor(245, 248, 255);
  doc.rect(15, currentY - 5, pageWidth - 30, recommendations.length * 12 + 15, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  recommendations.forEach((rec, index) => {
    checkPageBreak(15);
    const bullet = String.fromCharCode(8226);
    const recLines = doc.splitTextToSize(`${bullet} ${rec}`, pageWidth - 60);
    recLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 25, currentY + (lineIndex * 6));
    });
    currentY += recLines.length * 6 + 3;
  });

  currentY += 10;

  // Overall Health Score
  checkPageBreak(40);
  const totalScore = metrics.reduce((sum, metric) => sum + metric.score, 0);
  const maxScore = 12;
  const healthPercentage = Math.round((totalScore / maxScore) * 100);

  doc.setFillColor(63, 81, 181);
  doc.rect(15, currentY - 5, pageWidth - 30, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`🏆 Overall Health Score: ${totalScore.toFixed(1)}/${maxScore} (${healthPercentage}%)`, pageWidth / 2, currentY + 15, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Higher scores indicate better health outcomes and lifestyle choices', pageWidth / 2, currentY + 25, { align: 'center' });

  currentY += 45;

  // Important Notes Section
  checkPageBreak(50);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠️ Important Notes', 20, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const notes = [
    '• This assessment is for educational and wellness purposes only and does not replace professional medical advice',
    '• Please consult with a healthcare provider for any health concerns or before making significant lifestyle changes',
    '• Regular reassessment is recommended to track progress and update recommendations',
    '• This report is confidential and should be shared only with authorized healthcare providers or guardians'
  ];

  notes.forEach((note, index) => {
    const noteLines = doc.splitTextToSize(note, pageWidth - 40);
    noteLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 20, currentY + (lineIndex * 4));
    });
    currentY += noteLines.length * 4 + 2;
  });

  // Footer with watermark and branding
  const footerY = pageHeight - 30;
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('🔒 Confidential Health Report', 20, footerY);
  doc.text(`Generated by HealthPredict AI | Page 1 of ${doc.getNumberOfPages()}`, pageWidth - 20, footerY, { align: 'right' });
  doc.text('Powered by Doutly Technologies | www.healthpredict.in', pageWidth / 2, footerY + 10, { align: 'center' });

  // Watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(80);
  doc.setFont('helvetica', 'bold');
  doc.text('HEALTHPREDICT', pageWidth / 2, pageHeight / 2, { 
    align: 'center',
    angle: 45
  });

  // Save with clean filename
  const cleanName = assessmentData.socioDemographic.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`healthreport_${cleanName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper functions for scoring and assessment
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

function getDietScore(eatingHabits: any): number {
  const healthy = (eatingHabits.fruits + eatingHabits.vegetables + eatingHabits.cereals + eatingHabits.pulses) / 4;
  const unhealthy = (eatingHabits.snacks + eatingHabits.sweets + eatingHabits.beverages) / 3;
  return Math.max(0, Math.min(2, 2 - (unhealthy - healthy)));
}

function getDietAssessment(score: number): string {
  if (score >= 1.5) return 'Excellent nutrition with balanced healthy food choices';
  if (score >= 1) return 'Good nutrition habits with some room for improvement';
  return 'Dietary habits need significant improvement for better health';
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
  
  if (totalMinutes >= 420) return 2; // 60 min * 7 days
  if (totalMinutes >= 180) return 1; // 60 min * 3 days
  return 0;
}

function getPhysicalActivityAssessment(physicalActivity: any): string {
  const score = getPhysicalActivityScore(physicalActivity);
  if (score >= 1.5) return 'Excellent activity level - meets recommended guidelines for youth';
  if (score >= 1) return 'Good activity level - consider increasing frequency or duration';
  return 'Below recommended activity levels - significant improvement needed';
}

function getScreenScore(sedentaryBehavior: any): number {
  const totalScreenTime = sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime;
  if (totalScreenTime <= 1) return 2;
  if (totalScreenTime <= 2) return 1;
  return 0;
}

function getScreenTimeAssessment(sedentaryBehavior: any): string {
  const score = getScreenScore(sedentaryBehavior);
  if (score >= 1.5) return 'Excellent screen time management within healthy limits';
  if (score >= 1) return 'Moderate screen time - within acceptable range';
  return 'Excessive screen time - reduction strongly recommended';
}

function getSleepScore(sleepQuality: any): number {
  const sleepIssues = (sleepQuality.difficultyFallingAsleep + sleepQuality.wakeUpDuringSleep) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getSleepAssessment(sleepQuality: any): string {
  const score = getSleepScore(sleepQuality);
  if (score >= 1.5) return 'Excellent sleep quality supporting optimal health and development';
  if (score >= 1) return 'Good sleep quality with minor issues to address';
  return 'Poor sleep quality - professional consultation recommended';
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - (mentalHealth.bodyPerception - 1));
  const bullyingPenalty = mentalHealth.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getMentalHealthAssessment(mentalHealth: any): string {
  const score = getMentalHealthScore(mentalHealth);
  if (score >= 1.5) return 'Positive mental health and healthy body image';
  if (score >= 1) return 'Generally good mental health with some areas for support';
  return 'Mental health concerns identified - counseling support recommended';
}
