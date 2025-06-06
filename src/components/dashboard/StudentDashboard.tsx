
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { AssessmentData } from '../../types/assessment';
import { Download, User, School, Calendar, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhoneVerification from './PhoneVerification';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';

const StudentDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handlePhoneVerification = (data: AssessmentData) => {
    console.log('Phone verification successful, setting assessment data:', data);
    setAssessmentData(data);
  };

  const handleDownloadPDF = async () => {
    if (!assessmentData) {
      toast({
        title: "Error",
        description: "No assessment data available to generate report.",
        variant: "destructive"
      });
      return;
    }
    
    setDownloadLoading(true);
    try {
      console.log('Starting PDF generation...');
      await generateHealthReportPDF(assessmentData);
      toast({
        title: "Success!",
        description: "Your health report has been downloaded successfully. Check your Downloads folder.",
        duration: 5000
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate PDF report. Please check your internet connection and try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900"
            >
              Loading your health insights...
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              We're analyzing your data to provide personalized recommendations
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show phone verification if no assessment data
  if (!assessmentData) {
    return <PhoneVerification onVerified={handlePhoneVerification} />;
  }

  const getStrengths = () => {
    const strengths = [];
    const { bmi, physicalActivity, eatingHabits, sleepQuality } = assessmentData;
    
    if (bmi >= 18.5 && bmi < 25) {
      strengths.push("Healthy BMI range maintained");
    }
    
    if (physicalActivity.ptFrequency >= 3) {
      strengths.push("Regular physical activity participation");
    }
    
    if (eatingHabits.fruits >= 2 && eatingHabits.vegetables >= 2) {
      strengths.push("Good fruit and vegetable intake");
    }
    
    if (sleepQuality.difficultyFallingAsleep <= 1) {
      strengths.push("Good sleep quality");
    }
    
    return strengths.length > 0 ? strengths.slice(0, 2) : ["Completed health assessment", "Actively monitoring health"];
  };

  const getAreasToImprove = () => {
    const improvements = [];
    const { bmi, physicalActivity, eatingHabits, sedentaryBehavior } = assessmentData;
    
    if (bmi < 18.5) {
      improvements.push("Consider healthy weight gain strategies");
    } else if (bmi >= 25) {
      improvements.push("Focus on healthy weight management");
    }
    
    if (physicalActivity.ptFrequency < 3) {
      improvements.push("Increase physical activity frequency");
    }
    
    if (sedentaryBehavior.tvTime > 2 || sedentaryBehavior.mobileTime > 2) {
      improvements.push("Reduce screen time for better health");
    }
    
    if (eatingHabits.snacks > 2) {
      improvements.push("Limit processed snacks and choose healthier options");
    }
    
    return improvements.length > 0 ? improvements.slice(0, 2) : ["Continue healthy lifestyle habits", "Regular health monitoring"];
  };

  const getAITips = () => {
    const tips = assessmentData.aiPrediction?.recommendations || [
      "Maintain regular physical activity for 60 minutes daily",
      "Include more fruits and vegetables in your diet",
      "Ensure 8-9 hours of quality sleep each night"
    ];
    
    return {
      brain: tips[0] || "Practice mindfulness and stress management techniques",
      nutrition: tips[1] || "Stay hydrated and eat balanced meals",
      sleep: tips[2] || "Maintain consistent sleep schedule"
    };
  };

  const strengths = getStrengths();
  const improvements = getAreasToImprove();
  const aiTips = getAITips();

  // Show dashboard when assessment data is available
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto max-w-4xl space-y-6"
      >
        {/* Main Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-gray-200 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-center">
                🎉 Welcome, {assessmentData.socioDemographic.name}!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Student Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span><strong>Name:</strong> {assessmentData.socioDemographic.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="w-5 h-5 text-blue-600" />
                  <span><strong>School:</strong> {assessmentData.socioDemographic.schoolName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span><strong>🎂 Age:</strong> {assessmentData.socioDemographic.age}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span><strong>🚻 Gender:</strong> {assessmentData.socioDemographic.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span><strong>⚖️ BMI:</strong> {assessmentData.bmi.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span><strong>📊 Risk Level:</strong> {assessmentData.aiPrediction?.riskLevel || 'Medium'}</span>
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span><strong>Assessment Date:</strong> {new Date(assessmentData.completedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Strengths Section */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-600">✅ Strengths:</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                  {strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve Section */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-yellow-600">⚠️ Areas to Improve:</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                  {improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>

              {/* AI Health Tips Section */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-600">💡 AI Health Tips:</h3>
                </div>
                <div className="space-y-3 ml-8">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🧠</span>
                    <p className="text-gray-700">{aiTips.brain}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🥗</span>
                    <p className="text-gray-700">{aiTips.nutrition}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🛌</span>
                    <p className="text-gray-700">{aiTips.sleep}</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="border-t pt-6 text-center">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={downloadLoading || !assessmentData}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>📥 Download Full Health Report as PDF</span>
                    </>
                  )}
                </Button>
                {downloadLoading && (
                  <p className="text-sm text-gray-600 mt-2">
                    Please wait while we generate your personalized health report...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
