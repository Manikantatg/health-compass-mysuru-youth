import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Brain, Activity, Moon, UtensilsCrossed, Monitor, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { exportAssessmentsPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';

interface Assessment {
  id: string;
  userId: string;
  socioDemographic: any;
  eatingHabits: any;
  physicalActivity: any;
  sedentaryBehavior: any;
  mentalHealth: any;
  sleepQuality: any;
  bmi: number;
  aiPrediction: string;
  completedAt: Date;
  scores: any;
  metadata: any;
}

const AdminDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'assessments'), orderBy('completedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const assessmentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to Date object
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : new Date(data.completedAt)
        };
      }) as Assessment[];
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBMIDistributionData = () => {
    const underweight = assessments.filter(a => a.bmi < 18.5).length;
    const healthy = assessments.filter(a => a.bmi >= 18.5 && a.bmi < 25).length;
    const overweight = assessments.filter(a => a.bmi >= 25 && a.bmi < 30).length;
    const obese = assessments.filter(a => a.bmi >= 30).length;

    return [
      { name: 'Underweight', value: underweight, color: '#82ca9d' },
      { name: 'Healthy', value: healthy, color: '#a8e6cf' },
      { name: 'Overweight', value: overweight, color: '#ffdac1' },
      { name: 'Obese', value: obese, color: '#e29578' },
    ];
  };

  const getRiskFactorsData = () => {
    const sedentary = assessments.filter(a => a.sedentaryBehavior?.tvTime > 3 || a.sedentaryBehavior?.mobileTime > 3).length;
    const poorDiet = assessments.filter(a => a.eatingHabits?.junkFood > 2 || a.eatingHabits?.softDrinks > 2).length;
    const sleepIssues = assessments.filter(a => a.sleepQuality?.difficultyFallingAsleep > 2 || a.sleepQuality?.wakeUpDuringSleep > 2).length;
    const mentalHealthIssues = assessments.filter(a => (a.mentalHealth?.bullyingExperience || false) || (a.mentalHealth?.feelLonely || 0) > 2).length;

    return [
      { name: 'Sedentary Lifestyle', count: sedentary },
      { name: 'Poor Diet', count: poorDiet },
      { name: 'Sleep Issues', count: sleepIssues },
      { name: 'Mental Health Concerns', count: mentalHealthIssues },
    ];
  };

  const getTrendsData = () => {
    const monthlyData: { [key: string]: number } = {};
    assessments.forEach(assessment => {
      // Ensure completedAt is a proper Date object before calling toISOString
      const completedAt = assessment.completedAt instanceof Date ? 
        assessment.completedAt : 
        new Date(assessment.completedAt);
      const month = completedAt.toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  };

  // Simplified School Performance Analysis
  const getSchoolPerformanceData = () => {
    const schoolStats = assessments.reduce((acc, assessment) => {
      const schoolName = assessment.socioDemographic?.schoolName || 'Unknown School';
      
      if (!acc[schoolName]) {
        acc[schoolName] = {
          name: schoolName,
          totalStudents: 0,
          averageBMI: 0,
          healthyCount: 0,
          atRiskCount: 0,
          highRiskCount: 0
        };
      }
      
      acc[schoolName].totalStudents++;
      
      const bmi = assessment.bmi || 0;
      acc[schoolName].averageBMI += bmi;
      
      // Simple risk categorization
      if (bmi < 18.5 || bmi > 25) {
        if (bmi < 16 || bmi > 30) {
          acc[schoolName].highRiskCount++;
        } else {
          acc[schoolName].atRiskCount++;
        }
      } else {
        acc[schoolName].healthyCount++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(schoolStats).map((school: any) => ({
      ...school,
      averageBMI: parseFloat((school.averageBMI / school.totalStudents).toFixed(1)),
      healthyPercent: Math.round((school.healthyCount / school.totalStudents) * 100),
      atRiskPercent: Math.round((school.atRiskCount / school.totalStudents) * 100),
      highRiskPercent: Math.round((school.highRiskCount / school.totalStudents) * 100)
    }));
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportAssessmentsPDF(assessments);
      toast({
        title: "Export Successful",
        description: `Successfully exported ${assessments.length} assessments to PDF`,
        duration: 3000
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export assessments. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const schoolPerformanceData = getSchoolPerformanceData();
  const bmiDistributionData = getBMIDistributionData();
  const riskFactorsData = getRiskFactorsData();
  const trendsData = getTrendsData();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive health assessment analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export PDF Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(assessments.map(a => a.socioDemographic?.schoolName)).size} schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average BMI</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.length > 0 ? 
                (assessments.reduce((sum, a) => sum + (a.bmi || 0), 0) / assessments.length).toFixed(1) : 
                '0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Overall student average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {assessments.filter(a => {
                const bmi = a.bmi || 0;
                return bmi < 18.5 || bmi > 25;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((assessments.filter(a => {
                const bmi = a.bmi || 0;
                return bmi < 18.5 || bmi > 25;
              }).length / Math.max(assessments.length, 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mental Health Issues</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {assessments.filter(a => 
                (a.mentalHealth?.bullyingExperience || false) ||
                (a.mentalHealth?.feelLonely || 0) > 2
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Students with concerns</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple School Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>School Performance Overview</CardTitle>
            <CardDescription>Health metrics comparison across schools</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schoolPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalStudents" fill="#8884d8" name="Total Students" />
                <Bar dataKey="healthyPercent" fill="#82ca9d" name="Healthy %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BMI Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>BMI Distribution</CardTitle>
            <CardDescription>Student weight categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bmiDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bmiDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors Analysis</CardTitle>
            <CardDescription>Key health risk indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskFactorsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Trends</CardTitle>
            <CardDescription>Monthly assessment completion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
