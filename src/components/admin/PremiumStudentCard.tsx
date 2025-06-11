import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '../../types/assessment';
import { ChevronDown, ChevronUp, Download, User, School, Calendar, Activity, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import jsPDF from 'jspdf';

interface PremiumStudentCardProps {
  assessment: AssessmentData;
  viewMode?: 'grid' | 'list';
  onDelete: (id: string) => void;
  onEdit: (assessment: AssessmentData) => void;
}

const PremiumStudentCard: React.FC<PremiumStudentCardProps> = ({ assessment, viewMode = 'grid', onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': 
        return { 
          color: 'risk-low',
          bgColor: 'bg-green-500'
        };
      case 'medium': 
        return { 
          color: 'risk-medium',
          bgColor: 'bg-amber-500'
        };
      case 'high': 
        return { 
          color: 'risk-high',
          bgColor: 'bg-red-500'
        };
      default: 
        return { 
          color: 'bg-surface text-muted-foreground border-border',
          bgColor: 'bg-muted'
        };
    }
  };

  const getHealthScore = (): number => {
    const { physicalActivity, eatingHabits, sleepQuality, mentalHealth, bmi } = assessment;
    
    // Calculate BMI score (0-25)
    let bmiScore = 25;
    if (bmi >= 30) {
      bmiScore = 0; // Obese
    } else if (bmi >= 25) {
      bmiScore = 10; // Overweight
    } else if (bmi >= 18.5) {
      bmiScore = 25; // Normal
    } else {
      bmiScore = 15; // Underweight
    }
    
    // Calculate activity score (0-25)
    const activityScore = Math.min((physicalActivity.ptFrequency * 5), 25);
    
    // Calculate diet score (0-25)
    const healthyFoods = (eatingHabits.fruits + eatingHabits.vegetables) / 2;
    const unhealthyFoods = (eatingHabits.snacks + eatingHabits.sweets + eatingHabits.beverages) / 3;
    const dietScore = Math.max(0, 25 - (unhealthyFoods - healthyFoods) * 5);
    
    // Calculate sleep score (0-25)
    const sleepIssues = (sleepQuality.difficultyFallingAsleep + sleepQuality.wakeUpDuringSleep) / 2;
    const sleepScore = Math.max(0, 25 - (sleepIssues * 5));
    
    // Calculate mental health score (0-25)
    const mentalScore = Math.max(0, 25 - (mentalHealth.bodyPerception * 5));
    
    const totalScore = Math.round(bmiScore + activityScore + dietScore + sleepScore + mentalScore);
    
    // Convert health score to risk score (invert the scale)
    const riskScore = 100 - totalScore;
    
    // Update risk level based on risk score (higher score = higher risk)
    if (riskScore <= 20) {
      assessment.aiPrediction.riskLevel = 'Low';
      assessment.aiPrediction.riskPercentage = riskScore; // Use risk score directly
    } else if (riskScore <= 50) {
      assessment.aiPrediction.riskLevel = 'Medium';
      assessment.aiPrediction.riskPercentage = riskScore; // Use risk score directly
    } else {
      assessment.aiPrediction.riskLevel = 'High';
      assessment.aiPrediction.riskPercentage = riskScore; // Use risk score directly
    }
    
    return riskScore; // Return risk score
  };

  // Helper function to safely display activity values
  const getActivityDisplay = (activity: any): string => {
    if (typeof activity === 'number') {
      return `${activity}h/week`;
    }
    if (typeof activity === 'object' && activity !== null && 'days' in activity && 'minutes' in activity) {
      const totalHours = (activity.days * activity.minutes) / 60;
      return `${totalHours.toFixed(1)}h/week`;
    }
    return '0h/week';
  };

  const handleDownloadPDF = async () => {
    try {
      await generateHealthReportPDF(assessment);
      toast({
        title: "Success",
        description: "Health report downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive"
      });
    }
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      let yPos = margin;

      // Header with Logo and Title
      doc.setFontSize(24);
      doc.setTextColor(63, 81, 181); // Blue color
      doc.text("PediaPredict", margin, yPos);
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text("Comprehensive Health Assessment Report", margin, yPos + 10);
      
      // Date and Report ID
      doc.setFontSize(10);
      const reportId = `RP${Date.now().toString().slice(-6)}`;
      doc.text(`Report ID: ${reportId}`, pageWidth - margin - 60, yPos);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, yPos + 5);
      
      yPos += 20;

      // Student Information Section
      doc.setFillColor(240, 240, 255);
      doc.rect(margin, yPos, contentWidth, 30, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text("Patient Information", margin + 5, yPos + 8);
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text([
        `Name: ${assessment.socioDemographic.name}`,
        `Age: ${assessment.socioDemographic.age} years | Gender: ${assessment.socioDemographic.gender}`,
        `School: ${assessment.socioDemographic.schoolName} | Class: ${assessment.socioDemographic.class}`,
        `Assessment Date: ${new Date(assessment.completedAt).toLocaleDateString()}`
      ], margin + 5, yPos + 15);
      
      yPos += 35;

      // Health Metrics Grid
      const gridWidth = contentWidth / 2;
      const gridHeight = 45;
      
      // Left Grid - Key Metrics
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPos, gridWidth, gridHeight, 'F');
      doc.setDrawColor(200);
      doc.rect(margin, yPos, gridWidth, gridHeight);
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text("Key Health Metrics", margin + 5, yPos + 8);
      
      // BMI
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text(`BMI: ${assessment.bmi.toFixed(1)} kg/m²`, margin + 5, yPos + 18);
      
      // Risk Score with color
      const riskColor = riskLevel === 'High' ? [220, 53, 69] : // Red
                       riskLevel === 'Medium' ? [255, 193, 7] : // Orange
                       [40, 167, 69]; // Green
      
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.text(`Risk Score: ${healthScore}/100`, margin + 5, yPos + 28);
      doc.text(`Risk Level: ${riskLevel}`, margin + 5, yPos + 38);
      
      // Right Grid - Physical Activity
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + gridWidth, yPos, gridWidth, gridHeight, 'F');
      doc.rect(margin + gridWidth, yPos, gridWidth, gridHeight);
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text("Physical Activity", margin + gridWidth + 5, yPos + 8);
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text([
        `PT Sessions: ${assessment.physicalActivity.ptFrequency}/week`,
        `Activity Level: ${assessment.physicalActivity.ptFrequency >= 3 ? 'Good' : 
                         assessment.physicalActivity.ptFrequency >= 1 ? 'Moderate' : 'Low'}`,
        `Sports Participation: ${assessment.physicalActivity.sportsParticipation ? 'Yes' : 'No'}`,
        `Regular Exercise: ${assessment.physicalActivity.regularExercise ? 'Yes' : 'No'}`
      ], margin + gridWidth + 5, yPos + 18);
      
      yPos += gridHeight + 10;

      // Health Assessment Section
      doc.setFillColor(240, 240, 255);
      doc.rect(margin, yPos, contentWidth, 50, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text("Comprehensive Health Assessment", margin + 5, yPos + 8);
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      
      // BMI Assessment
      const bmiStatus = assessment.bmi >= 30 ? 'Obesity' :
                       assessment.bmi >= 25 ? 'Overweight' :
                       assessment.bmi >= 18.5 ? 'Healthy' : 'Underweight';
      
      // Activity Assessment
      const activityStatus = assessment.physicalActivity.ptFrequency >= 3 ? 'Good' :
                           assessment.physicalActivity.ptFrequency >= 1 ? 'Moderate' : 'Low';
      
      // Diet Assessment
      const dietStatus = assessment.eatingHabits.fruits + assessment.eatingHabits.vegetables >= 4 ? 'Good' :
                        assessment.eatingHabits.fruits + assessment.eatingHabits.vegetables >= 2 ? 'Moderate' : 'Needs Improvement';
      
      // Sleep Assessment
      const sleepStatus = assessment.sleepQuality.difficultyFallingAsleep <= 2 ? 'Good' :
                         assessment.sleepQuality.difficultyFallingAsleep <= 3 ? 'Moderate' : 'Poor';

      const assessmentText = [
        `• BMI Status: ${bmiStatus} (${assessment.bmi.toFixed(1)} kg/m²)`,
        `• Physical Activity: ${activityStatus} (${assessment.physicalActivity.ptFrequency} PT sessions/week)`,
        `• Diet Quality: ${dietStatus} (Fruits & Vegetables intake)`,
        `• Sleep Quality: ${sleepStatus}`,
        `• Overall Health Status: ${riskLevel} Risk`
      ];
      
      doc.text(assessmentText, margin + 5, yPos + 15);
      
      yPos += 55;

      // Recommendations Section
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPos, contentWidth, 40, 'F');
      doc.setDrawColor(200);
      doc.rect(margin, yPos, contentWidth, 40);
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text("Medical Recommendations", margin + 5, yPos + 8);
      
      if (assessment.aiPrediction?.recommendations) {
        doc.setFontSize(10);
        doc.setTextColor(60);
        const recommendations = assessment.aiPrediction.recommendations
          .slice(0, 3)
          .map((rec, index) => `${index + 1}. ${rec}`);
        doc.text(recommendations, margin + 5, yPos + 15);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100);
      const footerText = [
        "Generated by PediaPredict - AI-Powered Health Assessment System",
        "This report is provided by Dr. AI, an advanced medical analysis system",
        "For medical advice, please consult with a healthcare professional",
        "Powered by Doutly.com"
      ];
      doc.text(footerText, pageWidth/2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

      // Save the PDF
      doc.save(`health-report-${assessment.socioDemographic.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const riskLevel = assessment.aiPrediction?.riskLevel || 'Medium';
  const riskConfig = getRiskConfig(riskLevel);
  const healthScore = getHealthScore();

  return (
    <motion.div
      layout
      className="h-fit w-full max-w-[500px] mx-auto"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="card-premium overflow-hidden group">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {assessment.socioDemographic.name}
                </h3>
                <p className="text-xs sm:text-sm text-caption">
                  {assessment.socioDemographic.age}y, {assessment.socioDemographic.gender}
                </p>
              </div>
            </div>
            
            <Badge className={`${riskConfig.color} font-medium px-2 sm:px-3 py-1 border text-xs sm:text-sm`}>
              {riskLevel} Risk
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <School className="h-3 w-3" />
                <span className="text-xs sm:text-sm">Class {assessment.socioDemographic.class}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                {assessment.socioDemographic.schoolName}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <Activity className="h-3 w-3" />
                <span className="text-xs sm:text-sm">Risk Score</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {healthScore}/100
              </p>
            </div>
          </div>

          {/* Risk Score Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-caption">
              <span className="text-xs sm:text-sm">Obesity Risk Level</span>
              <span className="text-xs sm:text-sm">{healthScore}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${riskConfig.bgColor}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* BMI & Date */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <span className="text-[#3F51B5]">⚖️</span>
                <span className="text-xs sm:text-sm">BMI</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {assessment.bmi.toFixed(1)} kg/m²
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <Calendar className="h-3 w-3" />
                <span className="text-xs sm:text-sm">Assessment Date</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {new Date(assessment.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center space-x-2 mt-4 text-xs sm:text-sm"
          >
            <span>{isExpanded ? 'See Less' : 'See More'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t">
                  {/* AI Analysis */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs sm:text-sm font-medium text-blue-800">Health Assessment</p>
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        {riskLevel} Risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {/* Primary Risk Factors */}
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <p className="text-xs text-blue-700">
                          {assessment.bmi >= 30 ? 'BMI of ' + assessment.bmi.toFixed(1) + ' indicates obesity' :
                           assessment.bmi >= 25 ? 'BMI of ' + assessment.bmi.toFixed(1) + ' shows overweight' :
                           assessment.bmi >= 18.5 ? 'BMI of ' + assessment.bmi.toFixed(1) + ' is healthy' :
                           'BMI of ' + assessment.bmi.toFixed(1) + ' indicates underweight'}
                        </p>
                      </div>

                      {/* Activity Level */}
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <p className="text-xs text-blue-700">
                          {assessment.physicalActivity.ptFrequency >= 3 ? 
                            'Good physical activity with ' + assessment.physicalActivity.ptFrequency + ' PT sessions weekly' :
                           assessment.physicalActivity.ptFrequency >= 1 ? 
                            'Limited physical activity with only ' + assessment.physicalActivity.ptFrequency + ' PT session weekly' :
                            'Insufficient physical activity - no regular PT sessions'}
                        </p>
                      </div>

                      {/* Diet Assessment */}
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <p className="text-xs text-blue-700">
                          {assessment.eatingHabits.fruits + assessment.eatingHabits.vegetables >= 4 ? 
                            'Healthy diet with good intake of fruits and vegetables' :
                           assessment.eatingHabits.fruits + assessment.eatingHabits.vegetables >= 2 ? 
                            'Moderate diet - could increase fruits and vegetables' :
                            'Diet needs improvement - low intake of fruits and vegetables'}
                        </p>
                      </div>

                      {/* Sleep Quality */}
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <p className="text-xs text-blue-700">
                          {assessment.sleepQuality.difficultyFallingAsleep <= 2 ? 
                            'Good sleep quality with minimal sleep issues' :
                           assessment.sleepQuality.difficultyFallingAsleep <= 3 ? 
                            'Moderate sleep issues affecting rest' :
                            'Significant sleep problems need attention'}
                        </p>
                      </div>

                      {/* Risk Level Summary */}
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <p className="text-xs font-medium text-blue-800">Risk Level Summary:</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {riskLevel === 'High' ? 
                            'Multiple risk factors identified. Immediate lifestyle changes recommended.' :
                           riskLevel === 'Medium' ? 
                            'Some health concerns present. Moderate lifestyle adjustments needed.' :
                            'Good overall health. Continue maintaining healthy habits.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {assessment.aiPrediction?.recommendations && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs sm:text-sm font-medium text-purple-800">Recommended Actions</p>
                        <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                          Priority Steps
                        </Badge>
                      </div>
                      <ul className="text-xs text-purple-700 space-y-1">
                        {assessment.aiPrediction.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-purple-600">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={generatePDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base sm:text-lg">Delete Assessment</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm">
                Are you sure you want to delete this assessment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete?.(assessment.id!);
                  setShowDeleteConfirm(false);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

export default PremiumStudentCard;
