import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, FileText, User, School, Calendar, Activity, Heart, Brain, AlertTriangle, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface PremiumStudentCardProps {
  assessment: AssessmentData;
  onDelete: () => void;
}

const PremiumStudentCard: React.FC<PremiumStudentCardProps> = ({ assessment, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return; // Prevent multiple clicks

    setIsGeneratingPDF(true);
    try {
      if (!assessment) {
        throw new Error('No assessment data available');
      }

      if (!assessment.aiPrediction) {
        throw new Error('AI prediction data is missing');
      }

      await generatePDF(assessment, assessment.aiPrediction);
      toast({
        title: "Success",
        description: "PDF report downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Heart className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const obesityRiskScore = assessment.physicalHealth?.obesityRisk || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {assessment.socioDemographic?.name || 'Unknown Student'}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-600">
                <School className="h-4 w-4 mr-1" />
                {assessment.socioDemographic?.schoolName || 'Unknown School'}
              </div>
            </div>
            <Badge className={`px-3 py-1 rounded-full border ${getRiskColor(assessment.aiPrediction?.riskLevel || '')}`}>
              <div className="flex items-center gap-1">
                {getRiskIcon(assessment.aiPrediction?.riskLevel || '')}
                <span className="font-medium">{assessment.aiPrediction?.riskLevel || 'Unknown'} Risk</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>Age: {assessment.socioDemographic?.age || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 mr-2 text-blue-600" />
                <span>BMI: {assessment.bmi || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <School className="h-4 w-4 mr-2 text-blue-600" />
                <span>School: {assessment.socioDemographic?.schoolName || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                <span>Class: {assessment.socioDemographic?.class || 'N/A'}</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Key Risk Factors</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {assessment.aiPrediction?.keyRiskFactors?.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {assessment.aiPrediction?.recommendations?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Read More</span>
                    </>
                  )}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PremiumStudentCard;