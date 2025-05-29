
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Activity, FileText, TrendingUp, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BMIChart from './BMIChart';
import RiskMeter from './RiskMeter';

const StudentDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [latestAssessment, setLatestAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

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
    // Simplified BMI categories for demonstration
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userProfile?.name || 'Student'}! 👋
        </h1>
        <p className="text-blue-100">
          Track your health journey and get personalized insights
        </p>
      </div>

      {!latestAssessment ? (
        // No Assessment State
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Take Your First Assessment</h3>
            <p className="text-gray-600 mb-6">
              Get started with our comprehensive health assessment to receive personalized insights and recommendations.
            </p>
            <Button onClick={() => navigate('/assessment')} size="lg">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-2xl font-bold">{latestAssessment.bmi}</p>
                    <p className={`text-xs ${getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).color}`}>
                      {getBMICategory(latestAssessment.bmi, latestAssessment.socioDemographic.age).category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`h-8 w-8 ${getRiskColor(latestAssessment.aiPrediction?.riskLevel || 'Medium')}`} />
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className={`text-xl font-bold ${getRiskColor(latestAssessment.aiPrediction?.riskLevel || 'Medium')}`}>
                      {latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {latestAssessment.aiPrediction?.riskPercentage || 50}% risk score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="text-2xl font-bold">{latestAssessment.socioDemographic.age}</p>
                    <p className="text-xs text-gray-500">years old</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Assessment</p>
                    <p className="text-sm font-medium">
                      {latestAssessment.completedAt instanceof Date 
                        ? latestAssessment.completedAt.toLocaleDateString()
                        : new Date(latestAssessment.completedAt).toLocaleDateString()
                      }
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Obesity Risk Assessment</CardTitle>
                <CardDescription>AI-powered analysis of your health data</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskMeter 
                  riskLevel={latestAssessment.aiPrediction?.riskLevel || 'Medium'}
                  riskPercentage={latestAssessment.aiPrediction?.riskPercentage || 50}
                />
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">AI Analysis:</p>
                  <p className="text-sm">{latestAssessment.aiPrediction?.explanation}</p>
                </div>
              </CardContent>
            </Card>

            {/* BMI Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>BMI Analysis</CardTitle>
                <CardDescription>Your Body Mass Index and category</CardDescription>
              </CardHeader>
              <CardContent>
                <BMIChart 
                  bmi={latestAssessment.bmi}
                  age={latestAssessment.socioDemographic.age}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {latestAssessment.aiPrediction?.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/assessment')} variant="outline">
              Take New Assessment
            </Button>
            <Button onClick={() => navigate('/profile')}>
              View Full Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
