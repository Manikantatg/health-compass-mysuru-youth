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
import { Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';

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
          variant: "success",
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
        variant: "success",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
            <p className="text-gray-600">Your personalized health assessment report</p>
          </div>

          {/* Risk Level Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Risk Assessment</span>
                <Badge variant={
                  aiPrediction.riskLevel === 'High' ? 'destructive' :
                  aiPrediction.riskLevel === 'Medium' ? 'warning' :
                  'success'
                }>
                  {aiPrediction.riskLevel} Risk
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risk Level</span>
                    <span>{aiPrediction.riskPercentage}%</span>
                  </div>
                  <Progress value={aiPrediction.riskPercentage} className="h-2" />
                </div>
                <p className="text-gray-600">{aiPrediction.explanation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Key Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiPrediction.keyRiskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiPrediction.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={handleDownloadPDF} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResult; 