
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, Activity, TrendingUp, AlertTriangle, School, Heart, Calendar, Clock } from 'lucide-react';
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

  const getBMIData = () => {
    const underweight = assessments.filter(a => a.bmi < 18.5).length;
    const healthy = assessments.filter(a => a.bmi >= 18.5 && a.bmi < 25).length;
    const overweight = assessments.filter(a => a.bmi >= 25 && a.bmi < 30).length;
    const obese = assessments.filter(a => a.bmi >= 30).length;

    return [
      { name: 'Healthy Weight', value: healthy, color: '#22c55e', percentage: Math.round((healthy / assessments.length) * 100) },
      { name: 'Underweight', value: underweight, color: '#3b82f6', percentage: Math.round((underweight / assessments.length) * 100) },
      { name: 'Overweight', value: overweight, color: '#f59e0b', percentage: Math.round((overweight / assessments.length) * 100) },
      { name: 'Obese', value: obese, color: '#ef4444', percentage: Math.round((obese / assessments.length) * 100) },
    ];
  };

  const getSchoolData = () => {
    const schoolStats = assessments.reduce((acc, assessment) => {
      const schoolName = assessment.socioDemographic?.schoolName || 'Unknown School';
      
      if (!acc[schoolName]) {
        acc[schoolName] = {
          name: schoolName.length > 15 ? schoolName.substring(0, 15) + '...' : schoolName,
          fullName: schoolName,
          students: 0,
          averageBMI: 0,
          healthy: 0
        };
      }
      
      acc[schoolName].students++;
      acc[schoolName].averageBMI += assessment.bmi || 0;
      
      if (assessment.bmi >= 18.5 && assessment.bmi < 25) {
        acc[schoolName].healthy++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(schoolStats).map((school: any) => ({
      ...school,
      averageBMI: parseFloat((school.averageBMI / school.students).toFixed(1)),
      healthyRate: Math.round((school.healthy / school.students) * 100)
    })).slice(0, 8);
  };

  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: number } = {};
    assessments.forEach(assessment => {
      const completedAt = assessment.completedAt instanceof Date ? 
        assessment.completedAt : 
        new Date(assessment.completedAt);
      const month = completedAt.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, count]) => ({ month, assessments: count }))
      .slice(-6);
  };

  const getDailyTrends = () => {
    const dailyData: { [key: string]: number } = {};
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    assessments.forEach(assessment => {
      const completedAt = assessment.completedAt instanceof Date ? 
        assessment.completedAt : 
        new Date(assessment.completedAt);
      const day = completedAt.toISOString().split('T')[0];
      dailyData[day] = (dailyData[day] || 0) + 1;
    });

    return last30Days.map(day => ({
      day: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assessments: dailyData[day] || 0
    }));
  };

  const getCompletionRateTrends = () => {
    const weeklyData: { [key: string]: { started: number; completed: number } } = {};
    
    assessments.forEach(assessment => {
      const completedAt = assessment.completedAt instanceof Date ? 
        assessment.completedAt : 
        new Date(assessment.completedAt);
      const weekStart = new Date(completedAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!weeklyData[week]) {
        weeklyData[week] = { started: 0, completed: 0 };
      }
      
      weeklyData[week].started++;
      if (assessment.scores) {
        weeklyData[week].completed++;
      }
    });

    return Object.entries(weeklyData)
      .slice(-8)
      .map(([week, data]) => ({
        week,
        completionRate: data.started > 0 ? Math.round((data.completed / data.started) * 100) : 0,
        started: data.started,
        completed: data.completed
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

  const bmiData = getBMIData();
  const schoolData = getSchoolData();
  const trendsData = getMonthlyTrends();
  const dailyData = getDailyTrends();
  const completionData = getCompletionRateTrends();
  const totalSchools = new Set(assessments.map(a => a.socioDemographic?.schoolName)).size;
  const averageBMI = assessments.length > 0 ? 
    (assessments.reduce((sum, a) => sum + (a.bmi || 0), 0) / assessments.length).toFixed(1) : '0';
  const healthyStudents = assessments.filter(a => a.bmi >= 18.5 && a.bmi < 25).length;
  const atRiskStudents = assessments.filter(a => a.bmi < 18.5 || a.bmi >= 25).length;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
            <p className="text-muted-foreground mt-1">Comprehensive student health analytics</p>
          </div>
          <Button 
            onClick={handleExportPDF} 
            disabled={exporting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{assessments.length}</div>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                From {totalSchools} schools
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Students</CardTitle>
              <Heart className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{healthyStudents}</div>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                {Math.round((healthyStudents / Math.max(assessments.length, 1)) * 100)}% healthy weight
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average BMI</CardTitle>
              <Activity className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{averageBMI}</div>
              <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                Overall average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{atRiskStudents}</div>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                {Math.round((atRiskStudents / Math.max(assessments.length, 1)) * 100)}% need support
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BMI Distribution */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Weight Categories
              </CardTitle>
              <CardDescription>Student distribution by BMI categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bmiData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bmiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {bmiData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}: {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* School Comparison */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Schools Overview
              </CardTitle>
              <CardDescription>Student count by school</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={schoolData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} students`, 'Students']}
                    labelFormatter={(label) => {
                      const school = schoolData.find(s => s.name === label);
                      return school?.fullName || label;
                    }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Activity Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Monthly Assessment Trends - Bar Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Activity
              </CardTitle>
              <CardDescription>Assessment completion by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} assessments`, 'Completed']} />
                  <Bar 
                    dataKey="assessments" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Assessment History - Area Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Daily History (30 Days)
              </CardTitle>
              <CardDescription>Daily assessment activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} assessments`, 'Completed']} />
                  <Area 
                    type="monotone" 
                    dataKey="assessments" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Rate Trends */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Completion Rate
              </CardTitle>
              <CardDescription>Weekly completion rate trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={completionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Week of ${label}`}
                  />
                  <Bar 
                    dataKey="completionRate" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
