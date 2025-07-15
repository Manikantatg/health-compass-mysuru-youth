import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { AssessmentData, AIPrediction } from '../types/assessment';
import { generatePDF } from '../utils/pdfGenerator';
import { motion } from 'framer-motion';
import { useToast } from '../components/ui/use-toast';
import { Loader2, CheckCircle, AlertCircle, Download, User, School, Calendar } from 'lucide-react';

const AssessmentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Location state:', location.state);

        // Check if we have the required data in location state
        if (!location.state?.assessmentData || !location.state?.aiPrediction) {
          console.error('Missing assessment data:', location.state);
          setError('No assessment data found');
          toast({
            title: "No Assessment Data",
            description: "Please complete an assessment first.",
            variant: "destructive",
            duration: 3000
          });
          navigate('/assessment');
          return;
        }

        // Validate the data structure
        const { assessmentData: data, aiPrediction: prediction } = location.state;
        
        if (!data.socioDemographic?.name || !data.bmi || !prediction.riskLevel) {
          console.error('Invalid assessment data structure:', data);
          setError('Invalid assessment data');
          toast({
            title: "Invalid Data",
            description: "The assessment data is incomplete or invalid.",
            variant: "destructive",
            duration: 3000
          });
          navigate('/assessment');
          return;
        }

        // Set the data
        setAssessmentData(data);
        setAiPrediction(prediction);
        setIsLoading(false);

        // Show success toast
        toast({
          title: "Results Ready",
          description: "Your health assessment results are ready to view.",
        variant: "default",
          duration: 3000
        });
      } catch (error) {
        console.error('Error loading assessment data:', error);
        setError('Failed to load assessment data');
        toast({
          title: "Error Loading Results",
          description: "Failed to load assessment results. Please try again.",
          variant: "destructive",
          duration: 3000
        });
        navigate('/assessment');
      }
    };

    loadData();
  }, [location.state, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  if (error || !assessmentData || !aiPrediction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-gray-600">{error || 'No assessment data available'}</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/assessment')}>
              Start New Assessment
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      if (!assessmentData || !aiPrediction) {
        throw new Error('No data available for PDF generation');
      }
      await generatePDF(assessmentData, aiPrediction);
      toast({
        title: "PDF Downloaded",
        description: "Your assessment report has been downloaded successfully.",
        variant: "default",
        duration: 3000
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Assessment Results</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Your personalized health assessment report is ready.
            </p>
          </div>

          {/* Student Info Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm sm:text-base">{assessmentData.socioDemographic.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="h-4 w-4 text-gray-500" />
                  <span className="text-sm sm:text-base">{assessmentData.socioDemographic.schoolName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm sm:text-base">Class {assessmentData.socioDemographic.class}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Progress 
                      value={aiPrediction.riskPercentage} 
                      className="h-24 w-24 sm:h-32 sm:w-32"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg sm:text-2xl font-bold">
                        {aiPrediction.riskPercentage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <Badge 
                      variant={aiPrediction.riskLevel === 'High' ? 'destructive' : 
                              aiPrediction.riskLevel === 'Medium' ? 'warning' : 
                              'success'}
                      className="text-sm sm:text-base mb-2"
                    >
                      {aiPrediction.riskLevel} Risk
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Based on comprehensive health assessment
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Risk Factors Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Key Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiPrediction.keyRiskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiPrediction.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button 
              onClick={handleDownloadPDF} 
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResult; 