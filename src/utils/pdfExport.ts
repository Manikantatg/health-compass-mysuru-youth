
import { AssessmentData } from '../types/assessment';

export const generateHealthReportPDF = async (assessmentData: AssessmentData) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Helper function to add text with proper spacing and page breaks
    const addText = (text: string, x: number, y: number, options?: any) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
        currentY = 20;
      }
      doc.text(text, x, y, options);
      return y;
    };

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(63, 81, 181); // #3F51B5
    currentY = addText('HealthPredict', pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
    
    doc.setFontSize(18);
    currentY = addText('Student Wellness Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;
    
    // Generation timestamp
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
    doc.setTextColor(100, 100, 100);
    currentY = addText(`Report Generated: ${dateStr}, ${timeStr}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(63, 81, 181);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 15;

    // Student Information
    doc.setTextColor(63, 81, 181);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Student Information', 20, currentY);
    currentY += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const studentInfo = [
      `Name: ${assessmentData.socioDemographic.name || 'N/A'}`,
      `Age: ${assessmentData.socioDemographic.age || 'N/A'} years`,
      `Gender: ${(assessmentData.socioDemographic.gender || 'N/A').charAt(0).toUpperCase() + (assessmentData.socioDemographic.gender || '').slice(1)}`,
      `Class: ${assessmentData.socioDemographic.class || 'N/A'}-${assessmentData.socioDemographic.section || 'N/A'}`,
      `School: ${assessmentData.socioDemographic.schoolName || 'N/A'}`,
      `Assessment Date: ${new Date(assessmentData.completedAt).toLocaleDateString('en-GB') || 'N/A'}`,
      `BMI: ${assessmentData.bmi?.toFixed(1) || 'N/A'} (${getBMICategory(assessmentData.bmi || 0)})`
    ];

    studentInfo.forEach((info) => {
      currentY = addText(info, 20, currentY);
      currentY += 6;
    });
    currentY += 10;

    // Health Risk Summary
    doc.setLineWidth(0.3);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    const riskLevel = assessmentData.aiPrediction?.riskLevel || 'Medium';
    doc.setTextColor(220, 53, 69);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Health Risk Assessment', 20, currentY);
    currentY += 8;

    doc.setFontSize(14);
    currentY = addText(`Overall Risk Level: ${riskLevel.toUpperCase()} RISK`, 20, currentY);
    currentY += 15;

    // Health Score Breakdown
    doc.setTextColor(63, 81, 181);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Health Score Breakdown', 20, currentY);
    currentY += 10;

    // Fix: Properly handle scores with default values
    const scores = assessmentData.scores || {};
    const scoreItems = [
      { label: 'Eating Habits', score: scores.eatingHabitsScore || 0 },
      { label: 'Physical Activity', score: scores.physicalActivityScore || 0 },
      { label: 'Screen Time Management', score: scores.sedentaryScore || 0 },
      { label: 'Mental Health', score: scores.mentalHealthScore || 0 },
      { label: 'Sleep Quality', score: scores.sleepScore || 0 }
    ];

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    scoreItems.forEach((item) => {
      const scorePercentage = ((item.score / 10) * 100).toFixed(0);
      currentY = addText(`${item.label}: ${item.score.toFixed(1)}/10 (${scorePercentage}%)`, 25, currentY);
      currentY += 6;
    });
    currentY += 10;

    // Recommendations
    doc.setLineWidth(0.3);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    doc.setTextColor(40, 167, 69);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Health Recommendations', 20, currentY);
    currentY += 10;

    const recommendations = assessmentData.aiPrediction?.recommendations || [
      'Maintain regular physical activity for at least 60 minutes daily',
      'Include more fruits and vegetables in daily meals',
      'Limit recreational screen time to less than 2 hours per day',
      'Ensure 8-9 hours of quality sleep each night',
      'Practice stress management and maintain positive mental health'
    ];

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    recommendations.slice(0, 5).forEach((rec, index) => {
      currentY = addText(`${index + 1}. ${rec}`, 25, currentY);
      currentY += 6;
    });
    currentY += 15;

    // Footer
    doc.setLineWidth(0.3);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    doc.setTextColor(63, 81, 181);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    currentY = addText('HealthPredict - Confidential Medical Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    currentY = addText('This report is intended for healthcare professionals, educators, and guardians', pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    currentY = addText('to support comprehensive student health and wellness monitoring.', pageWidth / 2, currentY, { align: 'center' });

    // Generate filename
    const cleanName = (assessmentData.socioDemographic.name || 'student').replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr2 = now.toISOString().split('T')[0];
    const filename = `healthpredict_${cleanName}_${dateStr2}.pdf`;
    
    // Save the PDF
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
};

// Helper function for BMI categorization
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
