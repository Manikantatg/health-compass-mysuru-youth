
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Activity, TrendingUp, User, CheckCircle, FileText, AlertCircle } from 'lucide-react';
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
      case 'Low': return 'text-green-700';
      case 'Medium': return 'text-yellow-700';
      case 'High': return 'text-red-700';
      default: return 'text-gray-700';
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
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-700' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-700' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-700' };
    return { category: 'Obese', color: 'text-red-700' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-900">Loading your dashboard...</p>
            <p className="text-gray-600">Getting your health insights ready</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-8 p-6">
      {/* Welcome Header */}
      <div className="professional-gradient text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome, {userProfile?.name || 'Student'}
            </h1>
            <p className="text-blue-100 text-lg">
              Your health assessment results dashboard
            </p>
          </div>
        </div>
      </div>

      {!latestAssessment ? (
        // No Assessment State
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="text-center py-16">
            <div className="space-y-6">
              <div className="relative">
                <FileText className="h-20 w-20 text-blue-600 mx-auto" />
                <div className="absolute -top-2 -right-2 p-2 bg-blue-600 rounded-full">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-blue-900">
                  No Assessment Found
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Your health assessment results will appear here once completed.
                  Please contact your school administrator for assistance.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/profile')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Activity className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">BMI Score</p>
                    <p className="text-2xl font-bold text-gray-900">{latestAssessment.bmi}</p>
                    <p className={`text-xs font-medium ${getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).color}`}>
                      {getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Risk Level</p>
                    <p className={`text-xl font-bold ${getRiskColor(latestAssessment.aiPrediction?.riskLevel || 'Medium')}`}>
                      {latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {latestAssessment.aiPrediction?.riskPercentage || 50}% risk
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <User className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Age</p>
                    <p className="text-2xl font-bold text-gray-900">{latestAssessment.socioDemographic.age}</p>
                    <p className="text-xs text-gray-600 font-medium">years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-indigo-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Assessment</p>
                    <p className="text-sm font-bold text-gray-900">
                      {latestAssessment.completedAt instanceof Date 
                        ? latestAssessment.completedAt.toLocaleDateString()
                        : new Date(latestAssessment.completedAt).toLocaleDateString()
                      }
                    </p>
                    <p className="text-xs text-gray-600 font-medium">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Assessment */}
            <div className="space-y-6">
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    🎯 Your Health Assessment
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
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-700 font-bold mb-2">🤖 AI Analysis:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{latestAssessment.aiPrediction?.explanation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Verification for Pros/Cons */}
              <PhoneVerification 
                onVerified={() => setIsPhoneVerified(true)}
                isVerified={isPhoneVerified}
                fatherContact={latestAssessment.socioDemographic.fatherContact}
                motherContact={latestAssessment.socioDemographic.motherContact}
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
                <h2 className="text-3xl font-bold text-gray-900">
                  🔓 Detailed Analysis Unlocked
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
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                💡 Your Personalized Action Plan
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                AI-generated recommendations tailored for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {latestAssessment.aiPrediction?.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              📊 View Detailed Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
