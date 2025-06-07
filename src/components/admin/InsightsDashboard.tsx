
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightsDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const assessmentsQuery = query(
          collection(db, 'assessments'),
          orderBy('completedAt', 'desc')
        );
        const assessmentsSnapshot = await getDocs(assessmentsQuery);
        const assessmentsData = assessmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate() || new Date()
        })) as AssessmentData[];

        setAssessments(assessmentsData);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const getRiskBreakdownByClass = () => {
    const classRisks: { [key: string]: { high: number; medium: number; low: number; total: number } } = {};
    
    assessments.forEach(assessment => {
      const className = assessment.socioDemographic.class || 'Unknown';
      const risk = assessment.aiPrediction?.riskLevel || 'Medium';
      
      if (!classRisks[className]) {
        classRisks[className] = { high: 0, medium: 0, low: 0, total: 0 };
      }
      
      classRisks[className].total++;
      if (risk === 'High') classRisks[className].high++;
      else if (risk === 'Medium') classRisks[className].medium++;
      else classRisks[className].low++;
    });
    
    return Object.entries(classRisks).map(([className, risks]) => ({
      class: className,
      ...risks,
      highPercent: ((risks.high / risks.total) * 100).toFixed(1),
      mediumPercent: ((risks.medium / risks.total) * 100).toFixed(1),
      lowPercent: ((risks.low / risks.total) * 100).toFixed(1)
    }));
  };

  const getGenderWiseBMI = () => {
    const genderBMI: { [key: string]: number[] } = {};
    
    assessments.forEach(assessment => {
      const gender = assessment.socioDemographic.gender || 'other';
      if (!genderBMI[gender]) genderBMI[gender] = [];
      genderBMI[gender].push(assessment.bmi);
    });
    
    return Object.entries(genderBMI).map(([gender, bmis]) => ({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      avgBMI: (bmis.reduce((sum, bmi) => sum + bmi, 0) / bmis.length).toFixed(1),
      count: bmis.length,
      underweight: bmis.filter(bmi => bmi < 18.5).length,
      normal: bmis.filter(bmi => bmi >= 18.5 && bmi < 25).length,
      overweight: bmis.filter(bmi => bmi >= 25).length
    }));
  };

  const getWeeklySubmissions = () => {
    const weeklyData: { [key: string]: number } = {};
    
    assessments.forEach(assessment => {
      const weekKey = new Date(assessment.completedAt).toISOString().split('T')[0];
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
    });
    
    return Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7) // Last 7 days
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        submissions: count
      }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#3F51B5] border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-900">Loading Insights</p>
            <p className="text-gray-600">Analyzing health data...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const classRiskData = getRiskBreakdownByClass();
  const genderBMIData = getGenderWiseBMI();
  const weeklyData = getWeeklySubmissions();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-[#3F51B5]">Health Insights</h1>
          <p className="text-gray-600">
            Comprehensive analytics and trends from {assessments.length} student assessments
          </p>
        </motion.div>

        {/* Risk Breakdown by Class */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white shadow-lg border-[#3F51B5]/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#3F51B5] flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Risk Breakdown by Class</span>
              </CardTitle>
              <CardDescription>Health risk distribution across different classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold">Class</th>
                      <th className="text-center p-3 font-semibold">Total</th>
                      <th className="text-center p-3 font-semibold text-red-600">High Risk</th>
                      <th className="text-center p-3 font-semibold text-yellow-600">Medium Risk</th>
                      <th className="text-center p-3 font-semibold text-green-600">Low Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classRiskData.map((classData, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium">{classData.class}</td>
                        <td className="p-3 text-center">{classData.total}</td>
                        <td className="p-3 text-center">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            {classData.high} ({classData.highPercent}%)
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                            {classData.medium} ({classData.mediumPercent}%)
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {classData.low} ({classData.lowPercent}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender-wise BMI Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg border-[#3F51B5]/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#3F51B5] flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gender-wise BMI Distribution</span>
              </CardTitle>
              <CardDescription>BMI analysis across different genders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {genderBMIData.map((genderData, index) => (
                  <div key={index} className="bg-[#D0EBE4]/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-[#3F51B5] mb-3">{genderData.gender}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Students:</span>
                        <span className="font-medium">{genderData.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average BMI:</span>
                        <span className="font-medium">{genderData.avgBMI}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span>Underweight:</span>
                          <span className="text-blue-600">{genderData.underweight}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Normal:</span>
                          <span className="text-green-600">{genderData.normal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Overweight:</span>
                          <span className="text-red-600">{genderData.overweight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Submission Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white shadow-lg border-[#3F51B5]/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#3F51B5] flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Assessment Submissions</span>
              </CardTitle>
              <CardDescription>Assessment submission trends over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{day.date}</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="bg-[#3F51B5] h-3 rounded"
                        style={{ width: `${Math.max(day.submissions * 20, 20)}px` }}
                      ></div>
                      <span className="text-sm font-medium">{day.submissions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
