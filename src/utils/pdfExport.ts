// Helper function for BMI categorization
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

import { jsPDF } from 'jspdf';
import { AssessmentData } from '../types/assessment';

export const generateHealthReportPDF = async (assessmentData: AssessmentData) => {
  if (!assessmentData) {
    throw new Error('No assessment data provided');
  }

  if (!assessmentData.aiPrediction) {
    throw new Error('No AI prediction data available');
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // Helper function for adding text with options
    const addText = (text: string, x: number, y: number, options?: any) => {
      doc.text(text, x, y, options);
      return y;
    };

    // Add logo (with error handling)
    try {
      doc.addImage(
        'https://img.freepik.com/premium-vector/worried-man-with-obesity-clip-art-vector-illustration_136875-5657.jpg',
        'JPEG',
        20,
        20,
        30,
        30
      );
    } catch (imageError) {
      console.warn('Failed to load logo image:', imageError);
      // Continue without the logo
    }

    // Header with PediaPredict branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181);
    currentY = addText('PediaPredict', 60, 40);
    
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
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    currentY = addText(`Generated: ${dateStr} at ${timeStr}`, 60, currentY + 5);
    currentY += 15;

    // Separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(63, 81, 181);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 15;

    // Student Information
    doc.setTextColor(63, 81, 181);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Student Information', 20, currentY);
    currentY += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Safe data extraction with proper null checks
    const socioDemo = assessmentData.socioDemographic || {};
    const studentInfo = [
      `Name: ${socioDemo.name || 'Not Provided'}`,
      `Age: ${socioDemo.age || 'Not Provided'} years`,
      `Gender: ${socioDemo.gender ? socioDemo.gender.charAt(0).toUpperCase() + socioDemo.gender.slice(1) : 'Not Provided'}`,
      `Class: ${socioDemo.class || 'Not Provided'}-${socioDemo.section || 'Not Provided'}`,
      `School: ${socioDemo.schoolName || 'Not Provided'}`,
      `Assessment Date: ${assessmentData.completedAt ? new Date(assessmentData.completedAt).toLocaleDateString('en-GB') : 'Not Available'}`,
      `BMI: ${assessmentData.bmi ? assessmentData.bmi.toFixed(1) : 'Not Calculated'} (${getBMICategory(assessmentData.bmi || 0)})`
    ];

    studentInfo.forEach((info) => {
      currentY = addText(info, 20, currentY);
      currentY += 6;
    });
    currentY += 10;

    // Risk Level with color coding
    const riskLevel = assessmentData.aiPrediction.riskLevel || 'Medium';
    const riskColor: [number, number, number] = riskLevel === 'High' ? [220, 53, 69] : 
                     riskLevel === 'Medium' ? [255, 193, 7] : [40, 167, 69];
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    currentY = addText(`RISK LEVEL: ${riskLevel.toUpperCase()}`, 20, currentY);
    currentY += 15;

    // Assessment Categories
    doc.setTextColor(63, 81, 181);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Assessment Categories', 20, currentY);
    currentY += 8;

    const categoryItems = [
      'BMI Assessment',
      'Nutrition Habits',
      'Physical Activity',
      'Screen Time Management',
      'Sleep Quality',
      'Mental Health & Wellbeing'
    ];

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    categoryItems.forEach((item) => {
      currentY = addText(`• ${item}: Assessed`, 25, currentY);
      currentY += 5;
    });
    currentY += 10;

    // Recommendations
    doc.setLineWidth(0.3);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    doc.setTextColor(40, 167, 69);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    currentY = addText('Recommendations', 20, currentY);
    currentY += 8;

    const recommendations = assessmentData.aiPrediction.recommendations || [
      'Maintain regular physical activity for at least 60 minutes daily',
      'Include more fruits and vegetables in daily meals',
      'Limit recreational screen time to less than 2 hours per day',
      'Ensure 8-9 hours of quality sleep each night',
      'Practice stress management and maintain positive mental health'
    ];

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    recommendations.slice(0, 3).forEach((rec, index) => {
      currentY = addText(`${index + 1}. ${rec}`, 25, currentY);
      currentY += 5;
    });

    // Footer with branding
    doc.setLineWidth(0.3);
    doc.line(20, doc.internal.pageSize.getHeight() - 20, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);
    
    doc.setTextColor(63, 81, 181);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PediaPredict | Confidential Health Report', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Powered by Doutly  | www.pediapredict.com', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Generate safe filename
    const cleanName = (socioDemo.name || 'student').replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr2 = now.toISOString().split('T')[0];
    const timeStamp = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `pediapredict_health_${cleanName}_${dateStr2}_${timeStamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report. Please check your data and try again.');
  }
};
