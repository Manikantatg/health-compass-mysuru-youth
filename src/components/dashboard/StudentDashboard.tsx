import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { AssessmentData } from '../../types/assessment';
import { Download, User, School, Calendar, TrendingUp, AlertTriangle, Lightbulb, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const StudentDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searching, setSearching] = useState(false);

  const handleNameSearch = async () => {
    if (!searchName.trim()) {
      toast({
        title: "Please enter a name",
        description: "Enter your full name to search for your health report.",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    try {
      const assessmentsQuery = query(
        collection(db, 'assessments'),
        where('socioDemographic.name', '==', searchName.trim())
      );
      const querySnapshot = await getDocs(assessmentsQuery);
      
      if (!querySnapshot.empty) {
        const latestAssessment = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data(), completedAt: doc.data().completedAt?.toDate() || new Date() }))
          .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0] as AssessmentData;
        
        setAssessmentData(latestAssessment);
        toast({
          title: "Report Found!",
          description: "Your health assessment report has been loaded successfully.",
          duration: 3000
        });
      } else {
        toast({
          title: "No Report Found",
          description: "No health assessment found for this name. Please check the spelling or complete an assessment first.",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error searching for assessment:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
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
      await generateHealthReportPDF(assessmentData);
      toast({
        title: "Success!",
        description: "Your health report has been downloaded successfully.",
        duration: 5000
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading || searching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3F51B5] border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              {searching ? 'Searching for your report...' : 'Loading your health insights...'}
            </p>
            <p className="text-gray-600">Please wait while we process your request</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 font-['Inter']">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto max-w-2xl space-y-6"
        >
          <Card className="border-2 border-[#3F51B5]/20 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#3F51B5] to-[#3F51B5]/80 text-white rounded-t-lg text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
                <Search className="w-6 h-6" />
                <span>Access Your Health Report</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter your full name to view your personalized health assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-700">
                  Enter Your Full Name
                </label>
                <Input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Type your complete name as submitted in assessment"
                  className="text-lg p-4 border-2 border-gray-200 focus:border-[#3F51B5] rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSearch()}
                />
                <Button
                  onClick={handleNameSearch}
                  disabled={!searchName.trim() || searching}
                  className="w-full bg-[#3F51B5] hover:bg-[#3F51B5]/90 text-white py-3 text-lg font-semibold rounded-lg"
                >
                  {searching ? 'Searching...' : 'Find My Report'}
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don't have a report yet?{' '}
                  <Button
                    variant="link"
                    onClick={() => navigate('/assessment')}
                    className="text-[#3F51B5] font-medium p-0"
                  >
                    Take Assessment
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
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
      activity: tips[0] || "Get 60 minutes of daily physical activity",
      nutrition: tips[1] || "Eat more fruits and vegetables daily",
      sleep: tips[2] || "Maintain consistent sleep schedule for 8-9 hours"
    };
  };

  const strengths = getStrengths();
  const improvements = getAreasToImprove();
  const aiTips = getAITips();

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 font-['Inter']">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto max-w-5xl space-y-6"
      >
        <Card className="border-2 border-[#3F51B5]/20 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#3F51B5] to-[#3F51B5]/80 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center space-x-2">
              <User className="w-8 h-8" />
              <span>Welcome, {assessmentData.socioDemographic.name}!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Student Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#3F51B5] flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-[#3F51B5]" />
                    <span><strong>Name:</strong> {assessmentData.socioDemographic.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <School className="w-4 h-4 text-[#3F51B5]" />
                    <span><strong>School:</strong> {assessmentData.socioDemographic.schoolName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#3F51B5]">🎂</span>
                    <span><strong>Age:</strong> {assessmentData.socioDemographic.age} years</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#3F51B5]">👤</span>
                    <span><strong>Gender:</strong> {assessmentData.socioDemographic.gender}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#3F51B5]">⚖️</span>
                    <span><strong>BMI:</strong> {assessmentData.bmi.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#3F51B5]">📊</span>
                    <span><strong>Risk Level:</strong> {assessmentData.aiPrediction?.riskLevel || 'Medium'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-[#3F51B5]" />
                    <span><strong>Assessment Date:</strong> {new Date(assessmentData.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Health Summary */}
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-bold text-green-600 flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 text-sm">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas to Improve */}
                <div>
                  <h3 className="text-lg font-bold text-yellow-600 flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Areas to Improve</span>
                  </h3>
                  <ul className="space-y-2">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-sm">⚠</span>
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Tips */}
                <div>
                  <h3 className="text-lg font-bold text-[#3F51B5] flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5" />
                    <span>AI Health Tips</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">🏃</span>
                      <p className="text-gray-700">{aiTips.activity}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">🥗</span>
                      <p className="text-gray-700">{aiTips.nutrition}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">🛌</span>
                      <p className="text-gray-700">{aiTips.sleep}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="border-t pt-6 mt-8 text-center">
              <Button
                onClick={handleDownloadPDF}
                disabled={downloadLoading}
                className="bg-gradient-to-r from-[#3F51B5] to-[#3F51B5]/80 hover:from-[#3F51B5]/90 hover:to-[#3F51B5]/70 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto transform hover:scale-105 transition-all duration-200"
              >
                {downloadLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Full Health Report PDF</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
