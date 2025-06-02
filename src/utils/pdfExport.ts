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

  // Header with gradient background
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('🩺 Health Assessment Report', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Comprehensive Health & Wellness Analysis', pageWidth / 2, 35, { align: 'center' });

  currentY = 60;

  // Risk Level Section
  doc.setTextColor(0, 0, 0);
  const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
  const riskColor = riskLevel === 'Low' ? [34, 197, 94] : riskLevel === 'High' ? [239, 68, 68] : [245, 158, 11];
  
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(20, currentY, pageWidth - 40, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`🔎 Obesity Risk: ${riskLevel.toUpperCase()}`, pageWidth / 2, currentY + 17, { align: 'center' });

  currentY += 35;

  // Student Information
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Student Information', 20, currentY);
  currentY += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const studentInfo = [
    `Name: ${assessmentData.socioDemographic.name}`,
    `Age: ${assessmentData.socioDemographic.age} years`,
    `Gender: ${assessmentData.socioDemographic.gender}`,
    `Class: ${assessmentData.socioDemographic.class}-${assessmentData.socioDemographic.section}`,
    `School: ${assessmentData.socioDemographic.schoolName}`,
    `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString()}`,
    `BMI: ${assessmentData.bmi.toFixed(1)} kg/m²`
  ];

  studentInfo.forEach((info, index) => {
    doc.text(info, 20, currentY + (index * 8));
  });

  currentY += studentInfo.length * 8 + 15;

  // Summary Section
  checkPageBreak(30);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 Summary', 20, currentY);
  currentY += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const summary = assessmentData.aiPrediction?.explanation || 
    `Based on comprehensive health assessment, ${assessmentData.socioDemographic.name} shows ${riskLevel.toLowerCase()} risk for obesity-related health concerns. This assessment considers multiple factors including physical activity, nutrition, sleep patterns, and lifestyle behaviors.`;

  const summaryLines = doc.splitTextToSize(summary, pageWidth - 40);
  summaryLines.forEach((line: string, index: number) => {
    doc.text(line, 20, currentY + (index * 6));
  });

  currentY += summaryLines.length * 6 + 15;

  // Medical Analysis Section
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🩺 Medical Analysis', 20, currentY);
  currentY += 15;

  const getActivityScore = (activity: any): number => {
    if (typeof activity === 'object' && activity.days && activity.minutes) {
      return Math.min((activity.days * activity.minutes) / 60, 2);
    }
    return Math.min(Number(activity) || 0, 2);
  };

  const analysis = [
    `BMI: ${assessmentData.bmi.toFixed(1)} kg/m² (${getBMICategory(assessmentData.bmi)})`,
    `Diet Score: ${getDietScore(assessmentData.eatingHabits)}/2 - ${getDietAssessment(getDietScore(assessmentData.eatingHabits))}`,
    `Physical Activity: ${getPhysicalActivityAssessment(assessmentData.physicalActivity)}`,
    `Screen Time: ${getScreenTimeAssessment(assessmentData.sedentaryBehavior)}`,
    `Sleep Quality: ${getSleepAssessment(assessmentData.sleepQuality)}`,
    `Mental Health: ${getMentalHealthAssessment(assessmentData.mentalHealth)}`
  ];

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  analysis.forEach((item, index) => {
    checkPageBreak(8);
    doc.text(`• ${item}`, 25, currentY + (index * 8));
  });

  currentY += analysis.length * 8 + 15;

  // Recommendations Section
  checkPageBreak(40);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 Recommendations', 20, currentY);
  currentY += 15;

  const recommendations = assessmentData.aiPrediction?.recommendations || [
    'Maintain regular physical activity for at least 60 minutes daily',
    'Include more fruits and vegetables in daily diet',
    'Limit screen time to less than 2 hours per day',
    'Ensure 8-9 hours of quality sleep each night',
    'Practice stress management and positive body image'
  ];

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  recommendations.forEach((rec, index) => {
    checkPageBreak(12);
    const recLines = doc.splitTextToSize(`• ${rec}`, pageWidth - 50);
    recLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 25, currentY + (lineIndex * 6));
    });
    currentY += recLines.length * 6 + 2;
  });

  currentY += 10;

  // Score Breakdown
  checkPageBreak(30);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🧾 Score Breakdown', 20, currentY);
  currentY += 15;

  const scores = [
    `BMI: ${getBMIScore(assessmentData.bmi)}/2`,
    `Diet: ${getDietScore(assessmentData.eatingHabits)}/2`,
    `Activity: ${getPhysicalActivityScore(assessmentData.physicalActivity)}/2`,
    `Sleep: ${getSleepScore(assessmentData.sleepQuality)}/2`,
    `Screen Time: ${getScreenScore(assessmentData.sedentaryBehavior)}/2`,
    `Mental Health: ${getMentalHealthScore(assessmentData.mentalHealth)}/2`
  ];

  const totalScore = scores.reduce((sum, score) => {
    const value = parseFloat(score.split('/')[0]);
    return sum + value;
  }, 0);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(scores.join(' | '), 20, currentY);
  currentY += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`**Total Score: ${totalScore.toFixed(1)}/12**`, 20, currentY);

  currentY += 20;

  // Motivational Message
  checkPageBreak(30);
  doc.setFillColor(147, 51, 234);
  doc.rect(15, currentY - 5, pageWidth - 30, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const motivationalMessage = `🧠 "Great job on completing your health assessment! Every step towards better health counts. Keep up the excellent work!"`;
  const msgLines = doc.splitTextToSize(motivationalMessage, pageWidth - 50);
  msgLines.forEach((line: string, index: number) => {
    doc.text(line, pageWidth / 2, currentY + 5 + (index * 7), { align: 'center' });
  });

  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('By Doutly ✔️ ET Mark™', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text(`Report generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  doc.save(`${assessmentData.socioDemographic.name}_Health_Report.pdf`);
};

// Helper functions for scoring and assessment
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
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
  if (score >= 1.5) return 'Excellent nutrition habits';
  if (score >= 1) return 'Good nutrition with room for improvement';
  return 'Needs significant dietary improvements';
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
  if (score >= 1.5) return 'Excellent activity level - meets CDC guidelines';
  if (score >= 1) return 'Good activity level - could increase frequency';
  return 'Below recommended activity levels - needs improvement';
}

function getScreenScore(sedentaryBehavior: any): number {
  const totalScreenTime = sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime;
  if (totalScreenTime <= 1) return 2; // 0-1 hours
  if (totalScreenTime <= 2) return 1; // 2-3 hours
  return 0; // 3+ hours
}

function getScreenTimeAssessment(sedentaryBehavior: any): string {
  const score = getScreenScore(sedentaryBehavior);
  if (score >= 1.5) return 'Excellent screen time management';
  if (score >= 1) return 'Moderate screen time - within acceptable limits';
  return 'Excessive screen time - reduction recommended';
}

function getSleepScore(sleepQuality: any): number {
  const sleepIssues = (sleepQuality.difficultyFallingAsleep + sleepQuality.wakeUpDuringSleep) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getSleepAssessment(sleepQuality: any): string {
  const score = getSleepScore(sleepQuality);
  if (score >= 1.5) return 'Excellent sleep quality';
  if (score >= 1) return 'Good sleep with minor issues';
  return 'Poor sleep quality - intervention needed';
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - (mentalHealth.bodyPerception - 1));
  const bullyingPenalty = mentalHealth.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getMentalHealthAssessment(mentalHealth: any): string {
  const score = getMentalHealthScore(mentalHealth);
  if (score >= 1.5) return 'Positive mental health and body image';
  if (score >= 1) return 'Generally good mental health with some concerns';
  return 'Mental health support recommended';
}
