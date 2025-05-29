
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Activity, FileText, TrendingUp, AlertCircle, CheckCircle, User, Sparkles, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BMIChart from './BMIChart';
import RiskMeter from './RiskMeter';
import PhoneVerification from './PhoneVerification';
import ProsAndCons from './ProsAndCons';

const StudentDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [latestAssessment, setLatestAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    const fetchLatestAssessment = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, 'assessments'),
          where('userId', '==', currentUser.uid),
          orderBy('completedAt', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const assessmentDoc = querySnapshot.docs[0];
          setLatestAssessment({ id: assessmentDoc.id, ...assessmentDoc.data() } as AssessmentData);
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAssessment();
  }, [currentUser]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-50 border-green-200';
      case 'Medium': return 'bg-yellow-50 border-yellow-200';
      case 'High': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getBMICategory = (bmi: number, age: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Loading your dashboard... ✨
            </p>
            <p className="text-gray-600">Getting your health insights ready!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 space-y-8 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              Hey {userProfile?.name || 'Superstar'}! 🌟
            </h1>
            <p className="text-purple-100 text-lg">
              Your health journey dashboard is ready to glow! ✨
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <Target className="h-4 w-4" />
            <span>Track • Improve • Thrive</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <Zap className="h-4 w-4" />
            <span>Your health, your power!</span>
          </div>
        </div>
      </div>

      {!latestAssessment ? (
        // No Assessment State
        <Card className="border-dashed border-4 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105">
          <CardContent className="text-center py-16">
            <div className="space-y-6">
              <div className="relative">
                <FileText className="h-20 w-20 text-purple-400 mx-auto animate-bounce" />
                <div className="absolute -top-2 -right-2 p-2 bg-pink-500 rounded-full animate-ping">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ready to glow up your health? 🚀
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Take our super cool health assessment and unlock your personalized health insights! 
                  It's like a health check-up but way more fun! 💫
                </p>
              </div>
              <Button 
                onClick={() => navigate('/assessment')} 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transform hover:scale-110 transition-all duration-200 shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start My Health Journey ✨
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500 rounded-full animate-pulse">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-bold">BMI Score</p>
                    <p className="text-3xl font-black text-blue-800">{latestAssessment.bmi}</p>
                    <p className={`text-xs font-medium ${getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).color}`}>
                      {getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full animate-pulse ${getRiskColor(latestAssessment.aiPrediction?.riskLevel || 'Medium').replace('text-', 'bg-')}`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-bold">Risk Level</p>
                    <p className={`text-2xl font-black ${getRiskColor(latestAssessment.aiPrediction?.riskLevel || 'Medium')}`}>
                      {latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      {latestAssessment.aiPrediction?.riskPercentage || 50}% risk
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500 rounded-full animate-pulse">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-bold">Age</p>
                    <p className="text-3xl font-black text-purple-800">{latestAssessment.socioDemographic.age}</p>
                    <p className="text-xs text-purple-600 font-medium">years young</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-pink-500 rounded-full animate-pulse">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-pink-700 font-bold">Last Check</p>
                    <p className="text-sm font-black text-pink-800">
                      {latestAssessment.completedAt instanceof Date 
                        ? latestAssessment.completedAt.toLocaleDateString()
                        : new Date(latestAssessment.completedAt).toLocaleDateString()
                      }
                    </p>
                    <p className="text-xs text-pink-600 font-medium">Completed ✅</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Assessment */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    🎯 Your Health Score
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    AI-powered analysis of your health data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RiskMeter 
                    riskLevel={latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                    riskPercentage={latestAssessment.aiPrediction?.riskPercentage || 50}
                  />
                  
                  <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-200">
                    <p className="text-sm text-indigo-700 font-bold mb-2">🤖 AI Analysis:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{latestAssessment.aiPrediction?.explanation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Verification for Pros/Cons */}
              <PhoneVerification 
                onVerified={() => setIsPhoneVerified(true)}
                isVerified={isPhoneVerified}
              />
            </div>

            {/* BMI Visualization */}
            <BMIChart 
              bmi={latestAssessment.bmi}
              age={latestAssessment.socioDemographic.age}
            />
          </div>

          {/* Pros and Cons Section */}
          {isPhoneVerified && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🔓 Detailed Analysis Unlocked!
                </h2>
                <p className="text-gray-600 mt-2">Here's your personalized pros and cons breakdown</p>
              </div>
              <ProsAndCons 
                riskLevel={latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                bmi={latestAssessment.bmi}
                age={latestAssessment.socioDemographic.age}
              />
            </div>
          )}

          {/* Recommendations */}
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                💡 Your Personalized Action Plan
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                AI-generated recommendations just for you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {latestAssessment.aiPrediction?.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl border-2 border-teal-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-teal-900 font-medium leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/assessment')} 
              variant="outline"
              className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold py-3 rounded-2xl transform hover:scale-105 transition-all duration-200"
            >
              🔄 Take New Assessment
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-2xl transform hover:scale-105 transition-all duration-200"
            >
              📊 View Full Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
