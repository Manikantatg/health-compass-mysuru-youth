
import { AssessmentData } from '../types/assessment';

export const generateHealthReportPDF = async (assessmentData: AssessmentData) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('HealthPredict - Student Wellness Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    // Generation timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${dateStr} at ${timeStr}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;

    // Student Profile Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Profile', 20, currentY);
    currentY += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const studentInfo = [
      `Name: ${assessmentData.socioDemographic.name || 'N/A'}`,
      `Age: ${assessmentData.socioDemographic.age || 'N/A'} years`,
      `Gender: ${(assessmentData.socioDemographic.gender || 'N/A').charAt(0).toUpperCase() + (assessmentData.socioDemographic.gender || '').slice(1)}`,
      `Class: ${assessmentData.socioDemographic.class || 'N/A'}-${assessmentData.socioDemographic.section || 'N/A'}`,
      `School: ${assessmentData.socioDemographic.schoolName || 'N/A'}`,
      `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString('en-US') || 'N/A'}`
    ];

    studentInfo.forEach((info, index) => {
      doc.text(info, 20, currentY + (index * 5));
    });

    currentY += studentInfo.length * 5 + 15;

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Health Risk Summary
    const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Health Risk Summary', 20, currentY);
    currentY += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Overall Risk Level: ${riskLevel.toUpperCase()} RISK`, 20, currentY);
    currentY += 15;

    // Add separator line
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Health Insights Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Health Insights', 20, currentY);
    currentY += 10;

    // BMI Analysis
    const bmiCategory = getBMICategory(assessmentData.bmi || 0);
    const bmiAnalysis = getBMIAnalysis(assessmentData.bmi || 0, bmiCategory);
    addHealthInsight(doc, '1. BMI', `Value: ${(assessmentData.bmi || 0).toFixed(1)} (${bmiCategory})`, bmiAnalysis);

    // Nutrition Analysis
    const nutritionScore = getDietScore(assessmentData.eatingHabits);
    const nutritionAnalysis = getDietAnalysis(nutritionScore);
    addHealthInsight(doc, '2. Nutrition', nutritionAnalysis.assessment, nutritionAnalysis.action);

    // Physical Activity Analysis
    const activityScore = getPhysicalActivityScore(assessmentData.physicalActivity);
    const activityAnalysis = getActivityAnalysis(activityScore);
    addHealthInsight(doc, '3. Physical Activity', activityAnalysis.assessment, activityAnalysis.action);

    // Screen Time Analysis
    const screenScore = getScreenScore(assessmentData.sedentaryBehavior);
    const screenAnalysis = getScreenTimeAnalysis(screenScore);
    addHealthInsight(doc, '4. Screen Time', screenAnalysis.assessment, screenAnalysis.action);

    // Sleep Analysis
    const sleepScore = getSleepScore(assessmentData.sleepQuality);
    const sleepAnalysis = getSleepAnalysis(sleepScore);
    addHealthInsight(doc, '5. Sleep', sleepAnalysis.assessment, sleepAnalysis.action);

    // Mental Health Analysis
    const mentalScore = getMentalHealthScore(assessmentData.mentalHealth);
    const mentalAnalysis = getMentalHealthAnalysis(mentalScore);
    addHealthInsight(doc, '6. Mental Health', mentalAnalysis.assessment, mentalAnalysis.action);

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Recommended Actions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Actions', 20, currentY);
    currentY += 8;

    const recommendations = [
      'Perform physical activity for at least 60 minutes daily',
      'Eat more fruits, vegetables, and whole grains',
      'Reduce recreational screen time to under 2 hours per day',
      'Sleep 8 to 9 hours every night with a consistent bedtime',
      'Focus on positive body image and stress management'
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 20, currentY + (index * 5));
    });

    currentY += recommendations.length * 5 + 15;

    // Add separator line
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Confidential Health Report - For Medical Use Only', pageWidth / 2, currentY, { align: 'center' });

    // Helper function to add health insights
    function addHealthInsight(doc: any, title: string, status: string, action: string) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, currentY);
      currentY += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Status: ${status}`, 25, currentY);
      currentY += 4;
      
      if (action) {
        doc.text(`Action: ${action}`, 25, currentY);
        currentY += 4;
      }
      
      currentY += 3;
    }

    // Generate clean filename
    const cleanName = (assessmentData.socioDemographic.name || 'student').replace(/[^a-zA-Z0-9]/g, '');
    const dateStr2 = now.toLocaleDateString('en-US').replace(/\//g, '-');
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

function getBMIAnalysis(bmi: number, category: string): string {
  if (category === 'Normal Weight') return 'Healthy weight range maintained';
  if (category === 'Underweight') return 'Consult a nutritionist for healthy weight gain';
  if (category === 'Overweight') return 'Moderate lifestyle changes recommended';
  return 'Consult pediatric advisor for comprehensive weight management';
}

function getDietScore(eatingHabits: any): number {
  const healthy = ((eatingHabits?.fruits || 0) + (eatingHabits?.vegetables || 0) + (eatingHabits?.cereals || 0) + (eatingHabits?.pulses || 0)) / 4;
  const unhealthy = ((eatingHabits?.snacks || 0) + (eatingHabits?.sweets || 0) + (eatingHabits?.beverages || 0)) / 3;
  return Math.max(0, Math.min(2, 2 - (unhealthy - healthy)));
}

function getDietAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Excellent nutritional balance maintained',
    action: 'Continue current healthy eating patterns'
  };
  if (score >= 1) return {
    assessment: 'Good nutrition habits with room for improvement',
    action: 'Increase fruits and vegetables, reduce processed foods'
  };
  return {
    assessment: 'Dietary habits need significant improvement',
    action: 'Consult a nutritionist for meal planning guidance'
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
    assessment: 'Meets recommended 60 minutes per day',
    action: 'Maintain current activity levels'
  };
  if (score >= 1) return {
    assessment: 'Good activity level with room for improvement',
    action: 'Increase frequency or duration of activities'
  };
  return {
    assessment: 'Below recommended activity levels',
    action: 'Engage in at least 60 minutes of physical activity daily'
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
    assessment: 'Excellent screen time management within healthy limits',
    action: 'Continue current screen time habits'
  };
  if (score >= 1) return {
    assessment: 'Moderate screen time within acceptable range',
    action: 'Consider reducing by 30 minutes daily'
  };
  return {
    assessment: 'Excessive screen time detected',
    action: 'Gradually reduce to under 2 hours per day'
  };
}

function getSleepScore(sleepQuality: any): number {
  const sleepIssues = ((sleepQuality?.difficultyFallingAsleep || 0) + (sleepQuality?.wakeUpDuringSleep || 0)) / 2;
  return Math.max(0, 2 - sleepIssues);
}

function getSleepAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Excellent sleep quality supporting optimal development',
    action: 'Maintain current sleep schedule'
  };
  if (score >= 1) return {
    assessment: 'Good sleep quality with minor issues',
    action: 'Follow consistent bedtime routine'
  };
  return {
    assessment: 'Poor sleep quality',
    action: 'Improve bedtime routine and sleep hygiene'
  };
}

function getMentalHealthScore(mentalHealth: any): number {
  const bodyImageScore = Math.max(0, 2 - Math.abs((mentalHealth?.bodyPerception || 3) - 3));
  const bullyingPenalty = mentalHealth?.bullyingExperience ? 0.5 : 0;
  return Math.max(0, bodyImageScore - bullyingPenalty);
}

function getMentalHealthAnalysis(score: number) {
  if (score >= 1.5) return {
    assessment: 'Positive mental health and healthy body image',
    action: 'Continue building self-confidence and social connections'
  };
  if (score >= 1) return {
    assessment: 'Generally good mental health with some areas for support',
    action: 'Practice mindfulness and maintain positive relationships'
  };
  return {
    assessment: 'Signs of emotional stress',
    action: 'Seek guidance or counseling, talk to trusted adults'
  };
}
