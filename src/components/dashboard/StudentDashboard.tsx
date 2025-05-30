
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { AssessmentData } from '../../types/assessment';
import { Activity, TrendingUp, User, Heart, Brain, Shield, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BMIChart from './BMIChart';
import RiskMeter from './RiskMeter';
import PhoneVerification from './PhoneVerification';
import HealthSummary from './HealthSummary';
import ProfileSummaryCard from './ProfileSummaryCard';
import HealthCharts from './HealthCharts';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';

const StudentDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhoneVerification = (data: AssessmentData) => {
    setAssessmentData(data);
  };

  const handleDownloadPDF = async () => {
    if (!assessmentData) return;
    
    try {
      await generateHealthReportPDF(assessmentData);
      toast({
        title: "Success!",
        description: "Your health report has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

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
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <AnimatePresence mode="wait">
        {!assessmentData ? (
          <motion.div
            key="verification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PhoneVerification onVerified={handlePhoneVerification} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 space-y-8"
          >
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Health Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive insights powered by AI to help you achieve optimal wellness
              </p>
            </motion.div>

            {/* Profile Summary */}
            <ProfileSummaryCard assessmentData={assessmentData} />

            {/* Download Report Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Download Full Health Report (PDF)</span>
              </Button>
            </motion.div>

            {/* Health Summary */}
            <HealthSummary assessmentData={assessmentData} />

            {/* Visual Health Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Health Metrics Visualization
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Interactive charts showing your health data patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthCharts assessmentData={assessmentData} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Assessment */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white border-2 border-gray-200 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Your Health Assessment
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-medium">
                      AI-powered analysis of your health data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskMeter 
                      riskLevel={assessmentData.aiPrediction?.riskLevel || 'Medium'}
                      riskPercentage={assessmentData.aiPrediction?.riskPercentage || 50}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* BMI Visualization */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <BMIChart 
                  bmi={assessmentData.bmi}
                  age={assessmentData.socioDemographic.age}
                />
              </motion.div>
            </div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Your Personalized Action Plan
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    AI-generated recommendations tailored for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(assessmentData.aiPrediction?.recommendations || []).map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-800 font-medium leading-relaxed">{recommendation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
