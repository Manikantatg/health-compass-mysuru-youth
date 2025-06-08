import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Users, TrendingUp, Activity, BarChart3, Download, Plus, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, ScatterChart, Scatter } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAssessments(assessmentsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatistics = () => {
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalAssessments = assessments.length;
    const avgBMI = assessments.length > 0 
      ? (assessments.reduce((sum, a) => sum + a.bmi, 0) / assessments.length).toFixed(1)
      : '0';
    
    const completionRate = totalStudents > 0 ? ((totalAssessments / totalStudents) * 100).toFixed(1) : '0';

    const riskDistribution = assessments.reduce((acc, assessment) => {
      const risk = assessment.aiPrediction?.riskLevel || 'Medium';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStudents,
      totalAssessments,
      avgBMI,
      completionRate,
      riskDistribution
    };
  };

  const getSchoolData = () => {
    const schools = assessments.reduce((acc, assessment) => {
      const school = assessment.socioDemographic.schoolName || 'Unknown School';
      const submissionDate = assessment.completedAt || new Date();
      
      if (!acc[school]) {
        acc[school] = { 
          name: school, 
          students: 0, 
          avgBMI: 0, 
          totalBMI: 0, 
          highRisk: 0,
          lastSubmission: submissionDate,
          submissions: []
        };
      }
      
      acc[school].students += 1;
      acc[school].totalBMI += assessment.bmi || 0;
      acc[school].avgBMI = Number((acc[school].totalBMI / acc[school].students).toFixed(1));
      acc[school].submissions.push(submissionDate);
      
      if (assessment.aiPrediction?.riskLevel === 'High') {
        acc[school].highRisk += 1;
      }
      
      // Update last submission if this one is more recent
      if (submissionDate > acc[school].lastSubmission) {
        acc[school].lastSubmission = submissionDate;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(schools).slice(0, 6).map((school: any) => ({
      ...school,
      daysSinceLastSubmission: Math.floor((new Date().getTime() - school.lastSubmission.getTime()) / (1000 * 60 * 60 * 24))
    }));
  };

  const getRecentAssessments = () => {
    return assessments.slice(0, 5).map(assessment => ({
      id: assessment.id,
      name: assessment.socioDemographic.name,
      school: assessment.socioDemographic.schoolName,
      risk: assessment.aiPrediction?.riskLevel || 'Medium',
      date: assessment.completedAt,
      bmi: assessment.bmi
    }));
  };

  const getTrendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAssessments = assessments.filter(a => 
        a.completedAt.toISOString().split('T')[0] === dateStr
      );
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        assessments: dayAssessments.length,
        avgRisk: dayAssessments.length > 0 
          ? dayAssessments.filter(a => a.aiPrediction?.riskLevel === 'High').length / dayAssessments.length * 100 
          : 0
      });
    }
    return last7Days;
  };

  const stats = getStatistics();
  const schoolData = getSchoolData();
  const recentAssessments = getRecentAssessments();
  const trendData = getTrendData();

  const riskChartData = [
    { name: 'Low Risk', value: stats.riskDistribution.Low || 0, color: '#10B981' },
    { name: 'Medium Risk', value: stats.riskDistribution.Medium || 0, color: '#F59E0B' },
    { name: 'High Risk', value: stats.riskDistribution.High || 0, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-headline text-foreground">Loading Dashboard</p>
            <p className="text-caption text-muted-foreground">Preparing your health insights...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div className="space-y-1">
            <h1 className="text-hero text-foreground">
              Health Dashboard
            </h1>
            <p className="text-subhead text-muted-foreground">
              Real-time insights into student health metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/assessment')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Assessment</span>
            </Button>
            
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="btn-secondary flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>View Data</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="metric-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-caption">Total Students</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-success">
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-caption">Assessments</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalAssessments.toLocaleString()}
                </p>
                <p className="text-xs text-success">
                  {stats.completionRate}% completion rate
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-caption">Average BMI</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.avgBMI}
                </p>
                <p className="text-xs text-warning">
                  Within normal range
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="metric-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-caption">High Risk</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.riskDistribution.High || 0}
                </p>
                <p className="text-xs text-destructive">
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-headline text-foreground">Risk Distribution</CardTitle>
                <CardDescription className="text-caption text-muted-foreground">
                  Current obesity risk levels across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value, percent }) => 
                          `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                        }
                        labelLine={false}
                      >
                        {riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Assessment Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-headline text-foreground">Assessment Trends</CardTitle>
                <CardDescription className="text-caption text-muted-foreground">
                  Daily assessment completion over the last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="assessmentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="assessments"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#assessmentGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* School Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* School Performance - Updated with Scatter Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-headline text-foreground">School Performance Analysis</CardTitle>
                <CardDescription className="text-caption text-muted-foreground">
                  BMI vs Activity Level with submission timestamps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={schoolData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number"
                        dataKey="avgBMI"
                        name="Average BMI"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        domain={['dataMin - 1', 'dataMax + 1']}
                      />
                      <YAxis 
                        type="number"
                        dataKey="students"
                        name="Number of Students"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold text-foreground">{data.name}</p>
                                <p className="text-sm text-muted-foreground">Students: {data.students}</p>
                                <p className="text-sm text-muted-foreground">Avg BMI: {data.avgBMI}</p>
                                <p className="text-sm text-muted-foreground">High Risk: {data.highRisk}</p>
                                <p className="text-sm text-muted-foreground">
                                  Last submission: {data.daysSinceLastSubmission} days ago
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter 
                        dataKey="students" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        stroke="hsl(var(--primary))"
                        strokeWidth={1}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-headline text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-caption text-muted-foreground">
                  Latest health assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAssessments.map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center space-x-3 p-3 rounded-lg bg-surface">
                    <div className={`w-2 h-2 rounded-full ${
                      assessment.risk === 'Low' ? 'bg-success' :
                      assessment.risk === 'Medium' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {assessment.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {assessment.school}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">
                        BMI {assessment.bmi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assessment.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
