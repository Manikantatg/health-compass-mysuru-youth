import jsPDF from 'jspdf';
import { AssessmentData, AIPrediction } from '@/types/assessment';

// Helper function to validate assessment data
const validateAssessmentData = (data: AssessmentData) => {
  if (!data) return false;
  if (!data.socioDemographic) return false;
  if (!data.aiPrediction) return false;
  return true;
};

// Helper function to add grid lines
const addGridLines = (doc: jsPDF, startY: number, endY: number, margin: number, pageWidth: number) => {
  const gridSpacing = 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);

  // Vertical lines
  for (let x = margin; x <= pageWidth - margin; x += gridSpacing) {
    doc.line(x, startY, x, endY);
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSpacing) {
    doc.line(margin, y, pageWidth - margin, y);
  }
};

// Helper function to add section header
const addSectionHeader = (doc: jsPDF, title: string, y: number, margin: number, pageWidth: number) => {
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(title, margin, y);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  return y + 10;
};

// Helper function to add key-value pair
const addKeyValue = (doc: jsPDF, key: string, value: string, y: number, margin: number) => {
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${key}:`, margin, y);
  doc.setTextColor(60, 60, 60);
  doc.text(value, margin + 40, y);
  return y + 7;
};

// Helper function to add bullet point
const addBulletPoint = (doc: jsPDF, text: string, y: number, margin: number) => {
  const bulletPoint = '•';
  const textWidth = doc.getTextWidth(text);
  const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2) - 10;
  
  // Split text into multiple lines if needed
  const lines = doc.splitTextToSize(text, maxWidth);
  
  // Add bullet point to first line
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(bulletPoint, margin, y);
  doc.text(lines[0], margin + 5, y);
  
  // Add remaining lines indented
  let currentY = y;
  for (let i = 1; i < lines.length; i++) {
    currentY += 7;
    doc.text(lines[i], margin + 5, currentY);
  }
  
  return currentY + 7;
};

// Helper function to add list items
const addListItems = (doc: jsPDF, items: string[], y: number, margin: number) => {
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  items.forEach((item, index) => {
    doc.text(`• ${item}`, margin, y + (index * 7));
  });
  return y + (items.length * 7) + 10;
};

// Helper function to add page number
const addPageNumber = (doc: jsPDF, pageNumber: number, totalPages: number, margin: number, pageWidth: number) => {
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin - 30, doc.internal.pageSize.getHeight() - 10);
};

export const generatePDF = async (assessmentData: AssessmentData, aiPrediction?: AIPrediction) => {
  if (!validateAssessmentData(assessmentData)) {
    throw new Error('Invalid or incomplete assessment data');
  }

  const prediction = aiPrediction || assessmentData.aiPrediction;
  if (!prediction) {
    throw new Error('No AI prediction data available');
  }

  let doc: jsPDF;
  try {
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Add header with soft gradient background
    doc.setFillColor(245, 247, 250); // Soft blue-gray
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(70, 130, 180); // Steel blue
    doc.text('PediaPredict Health Report', margin, 20);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120); // Soft gray
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, 20);

    let currentY = 40;

    // Student Information Section
    currentY = addSectionHeader(doc, 'Student Information', currentY, margin, pageWidth);
    const socioDemo = assessmentData.socioDemographic || {};
    currentY = addKeyValue(doc, 'Name', socioDemo.name || 'N/A', currentY, margin);
    currentY = addKeyValue(doc, 'Age', socioDemo.age?.toString() || 'N/A', currentY, margin);
    currentY = addKeyValue(doc, 'Gender', socioDemo.gender || 'N/A', currentY, margin);
    currentY = addKeyValue(doc, 'School', socioDemo.schoolName || 'N/A', currentY, margin);
    currentY = addKeyValue(doc, 'Class', socioDemo.class || 'N/A', currentY, margin);
    currentY += 10;

    // Risk Assessment Section with Visual Indicator
    currentY = addSectionHeader(doc, 'Risk Assessment', currentY, margin, pageWidth);
    
    // Add risk percentage with visual indicator
    const riskPercentage = prediction.riskPercentage;
    const riskColor = prediction.riskLevel === 'High' ? [220, 53, 69] : 
                     prediction.riskLevel === 'Medium' ? [255, 193, 7] : 
                     [40, 167, 69];
    
    // Draw risk percentage circle
    const circleX = margin + 20;
    const circleY = currentY + 15;
    const circleRadius = 20;
    
    // Draw circle background
    doc.setFillColor(245, 247, 250); // Soft blue-gray
    doc.circle(circleX, circleY, circleRadius, 'F');
    
    // Draw percentage text
    doc.setFontSize(16);
    doc.setTextColor(...riskColor);
    doc.text(`${riskPercentage}%`, circleX, circleY + 5, { align: 'center' });
    
    // Draw risk level text
    doc.setFontSize(10);
    doc.text(prediction.riskLevel, circleX, circleY + 15, { align: 'center' });
    
    // Add risk level description
    doc.setFontSize(12);
    doc.setTextColor(70, 130, 180); // Steel blue
    doc.text('Risk Level:', margin + 50, currentY + 10);
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60); // Dark gray
    doc.text(prediction.riskLevel, margin + 50, currentY + 20);
    
    currentY += 60;

    // Key Findings Section
    currentY = addSectionHeader(doc, 'Key Findings', currentY, margin, pageWidth);
    prediction.keyRiskFactors.forEach((factor: string) => {
      currentY = addBulletPoint(doc, factor, currentY, margin);
    });
    currentY += 10;

    // Recommendations Section
    currentY = addSectionHeader(doc, 'Recommendations', currentY, margin, pageWidth);
    prediction.recommendations.forEach((recommendation: string) => {
      currentY = addBulletPoint(doc, recommendation, currentY, margin);
    });
    currentY += 10;

    // Add grid lines with softer color
    doc.setDrawColor(200, 200, 200); // Light gray
    addGridLines(doc, 40, pageHeight - 20, margin, pageWidth);

    // Add footer with softer colors and Doutly branding
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120); // Soft gray
    doc.text('Generated by PediaPredict AI', margin, pageHeight - 10);
    
    // Add "Provided by Doutly" in purple
    doc.setTextColor(124, 58, 237); // Purple color (indigo-600)
    doc.setFontSize(9);
    doc.text('Provided by Doutly', pageWidth - margin - 60, pageHeight - 10);
    
    // Add consultation note in gray
    doc.setTextColor(120, 120, 120); // Soft gray
    doc.setFontSize(7);
    doc.text('Please consult with healthcare professionals for detailed analysis.', pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Generate safe filename with timestamp
    const timestamp = new Date().getTime();
    const cleanName = (socioDemo.name || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `health-report-${cleanName}-${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate PDF report. Please check your data and try again.');
  }
}; 