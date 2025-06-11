import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AssessmentData, AIPrediction } from '@/types/assessment';

export const generatePDF = async (assessmentData: AssessmentData, aiPrediction: AIPrediction) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Add header with gradient background
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    // Add title and logo
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text('PediaPredict Health Report', margin, 20);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, 20);

    // Add student information section with grid
    doc.setFillColor(245, 247, 250); // Light gray background
    doc.rect(margin, 40, contentWidth, 30, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Student Information', margin + 5, 50);

    const studentInfo = [
      ['Name', assessmentData.socioDemographic?.name || 'N/A'],
      ['Age', assessmentData.socioDemographic?.age?.toString() || 'N/A'],
      ['Gender', assessmentData.socioDemographic?.gender || 'N/A'],
      ['School', assessmentData.socioDemographic?.schoolName || 'N/A'],
      ['Class', assessmentData.socioDemographic?.class || 'N/A']
    ];

    (doc as any).autoTable({
      startY: 55,
      head: [['Field', 'Value']],
      body: studentInfo,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    // Add risk assessment section with highlighted risk level
    const riskY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, riskY - 5, contentWidth, 25, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Risk Assessment', margin + 5, riskY + 5);

    const riskLevel = aiPrediction?.riskLevel || 'Unknown';
    const riskColor = riskLevel.toLowerCase() === 'high' ? [231, 76, 60] : 
                     riskLevel.toLowerCase() === 'medium' ? [241, 196, 15] : 
                     [46, 204, 113];

    (doc as any).autoTable({
      startY: riskY + 10,
      head: [['Risk Level', 'Confidence Score']],
      body: [[riskLevel, `${(aiPrediction?.confidenceScore || 0).toFixed(2)}%`]],
      theme: 'grid',
      headStyles: { fillColor: riskColor, textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    // Add health metrics section
    const metricsY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, metricsY - 5, contentWidth, 25, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Health Metrics', margin + 5, metricsY + 5);

    const metricsData = [
      ['BMI', assessmentData.bmi?.toString() || 'N/A'],
      ['Physical Activity', assessmentData.physicalHealth?.physicalActivity?.toString() || 'N/A'],
      ['Sleep Quality', assessmentData.physicalHealth?.sleepQuality?.toString() || 'N/A'],
      ['Stress Level', assessmentData.mentalHealth?.stressLevel?.toString() || 'N/A'],
      ['Academic Performance', assessmentData.mentalHealth?.academicPerformance?.toString() || 'N/A'],
      ['Obesity Risk Score', `${assessmentData.physicalHealth?.obesityRisk || 0}%`]
    ];

    (doc as any).autoTable({
      startY: metricsY + 10,
      head: [['Metric', 'Score']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    // Add key findings section
    const findingsY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, findingsY - 5, contentWidth, 25, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Key Findings', margin + 5, findingsY + 5);

    const keyFindings = aiPrediction?.keyRiskFactors?.slice(0, 3) || [];
    const findingsData = keyFindings.map(finding => [finding]);

    (doc as any).autoTable({
      startY: findingsY + 10,
      body: findingsData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    // Add recommendations section
    const recommendationsY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, recommendationsY - 5, contentWidth, 25, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Recommendations', margin + 5, recommendationsY + 5);

    const recommendations = aiPrediction?.recommendations?.slice(0, 3) || [];
    const recommendationData = recommendations.map(rec => [rec]);

    (doc as any).autoTable({
      startY: recommendationsY + 10,
      body: recommendationData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    // Add footer with AI attribution
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by PediaPredict AI', margin, footerY);
    doc.text('Provided by Dr. Doutly', pageWidth - margin - 60, footerY);

    // Save the PDF
    const filename = `health-report-${assessmentData.socioDemographic?.name?.toLowerCase().replace(/\s+/g, '-') || 'report'}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}; 