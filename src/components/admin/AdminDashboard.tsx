
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Users, TrendingUp, Activity, BarChart3, Download, Plus, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
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
      const school = assessment.socioDemographic.schoolName;
      if (!acc[school]) {
        acc[school] = { name: school, students: 0, avgBMI: 0, totalBMI: 0, highRisk: 0 };
      }
      acc[school].students += 1;
      acc[school].totalBMI += assessment.bmi;
      acc[school].avgBMI = Number((acc[school].totalBMI / acc[school].students).toFixed(1));
      if (assessment.aiPrediction?.riskLevel === 'High') {
        acc[school].highRisk += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(schools).slice(0, 6);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-headline text-slate-900 dark:text-slate-100">Loading Dashboard</p>
            <p className="text-caption">Preparing your health insights...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div className="space-y-1">
            <h1 className="text-hero text-slate-900 dark:text-slate-100">
              Health Dashboard
            </h1>
            <p className="text-subhead text-slate-600 dark:text-slate-400">
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
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
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
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.totalAssessments.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
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
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.avgBMI}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
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
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.riskDistribution.High || 0}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
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
                <CardTitle className="text-headline">Risk Distribution</CardTitle>
                <CardDescription className="text-caption">
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
                      <Tooltip />
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
                <CardTitle className="text-headline">Assessment Trends</CardTitle>
                <CardDescription className="text-caption">
                  Daily assessment completion over the last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="assessmentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="assessments"
                        stroke="#4F46E5"
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
          {/* School Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-headline">School Performance</CardTitle>
                <CardDescription className="text-caption">
                  Health metrics comparison across institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        type="number"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        type="category"
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="avgBMI" 
                        fill="#4F46E5" 
                        radius={[0, 6, 6, 0]}
                        name="Average BMI"
                      />
                    </BarChart>
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
                <CardTitle className="text-headline">Recent Activity</CardTitle>
                <CardDescription className="text-caption">
                  Latest health assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAssessments.map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-2 h-2 rounded-full ${
                      assessment.risk === 'Low' ? 'bg-emerald-500' :
                      assessment.risk === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {assessment.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {assessment.school}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        BMI {assessment.bmi}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
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
