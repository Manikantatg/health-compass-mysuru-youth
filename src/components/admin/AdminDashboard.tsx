
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Users, TrendingUp, Download, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assessments
        const assessmentsQuery = query(
          collection(db, 'assessments'),
          orderBy('completedAt', 'desc')
        );
        const assessmentsSnapshot = await getDocs(assessmentsQuery);
        const assessmentsData = assessmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AssessmentData[];

        // Fetch users
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

    const riskDistribution = assessments.reduce((acc, assessment) => {
      const risk = assessment.aiPrediction?.riskLevel || 'Medium';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStudents,
      totalAssessments,
      avgBMI,
      riskDistribution
    };
  };

  const getSchoolDistribution = () => {
    const schools = assessments.reduce((acc, assessment) => {
      const school = assessment.socioDemographic.schoolName;
      if (!acc[school]) {
        acc[school] = { name: school, students: 0, avgBMI: 0, totalBMI: 0 };
      }
      acc[school].students += 1;
      acc[school].totalBMI += assessment.bmi;
      acc[school].avgBMI = Number((acc[school].totalBMI / acc[school].students).toFixed(1));
      return acc;
    }, {} as Record<string, any>);

    return Object.values(schools);
  };

  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      const matchesSearch = searchTerm === '' || 
        assessment.socioDemographic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.socioDemographic.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSchool = filterSchool === 'all' || 
        assessment.socioDemographic.schoolName === filterSchool;
      
      const matchesRisk = filterRisk === 'all' || 
        assessment.aiPrediction?.riskLevel === filterRisk;

      return matchesSearch && matchesSchool && matchesRisk;
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'School', 'Age', 'Gender', 'BMI', 'Risk Level', 'Risk Percentage', 'Assessment Date'].join(','),
      ...getFilteredAssessments().map(assessment => [
        assessment.socioDemographic.name,
        assessment.socioDemographic.schoolName,
        assessment.socioDemographic.age,
        assessment.socioDemographic.gender,
        assessment.bmi,
        assessment.aiPrediction?.riskLevel || 'N/A',
        assessment.aiPrediction?.riskPercentage || 'N/A',
        new Date(assessment.completedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthPredict_Data_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = getStatistics();
  const schoolData = getSchoolDistribution();
  const uniqueSchools = [...new Set(assessments.map(a => a.socioDemographic.schoolName))];

  const riskChartData = [
    { name: 'Low', value: stats.riskDistribution.Low || 0, color: '#10B981' },
    { name: 'Medium', value: stats.riskDistribution.Medium || 0, color: '#F59E0B' },
    { name: 'High', value: stats.riskDistribution.High || 0, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">
          HealthPredict Administration Panel - Mysuru & Chamarajanagar Districts
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Assessments</p>
                <p className="text-2xl font-bold">{stats.totalAssessments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">BMI</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average BMI</p>
                <p className="text-2xl font-bold">{stats.avgBMI}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">🏫</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Schools</p>
                <p className="text-2xl font-bold">{uniqueSchools.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Obesity risk levels across all assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
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

        <Card>
          <CardHeader>
            <CardTitle>School-wise Analysis</CardTitle>
            <CardDescription>Average BMI by school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schoolData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgBMI" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Data Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Assessment Data</CardTitle>
              <CardDescription>Detailed view of all student assessments</CardDescription>
            </div>
            <Button onClick={exportData} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={filterSchool} onValueChange={setFilterSchool}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {uniqueSchools.map(school => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
                <SelectItem value="Medium">Medium Risk</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">Name</th>
                  <th className="border border-gray-200 p-2 text-left">School</th>
                  <th className="border border-gray-200 p-2 text-left">Age</th>
                  <th className="border border-gray-200 p-2 text-left">Gender</th>
                  <th className="border border-gray-200 p-2 text-left">BMI</th>
                  <th className="border border-gray-200 p-2 text-left">Risk Level</th>
                  <th className="border border-gray-200 p-2 text-left">Risk %</th>
                  <th className="border border-gray-200 p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAssessments().slice(0, 50).map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2">{assessment.socioDemographic.name}</td>
                    <td className="border border-gray-200 p-2">{assessment.socioDemographic.schoolName}</td>
                    <td className="border border-gray-200 p-2">{assessment.socioDemographic.age}</td>
                    <td className="border border-gray-200 p-2 capitalize">{assessment.socioDemographic.gender}</td>
                    <td className="border border-gray-200 p-2">{assessment.bmi}</td>
                    <td className="border border-gray-200 p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.aiPrediction?.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                        assessment.aiPrediction?.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assessment.aiPrediction?.riskLevel || 'N/A'}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-2">{assessment.aiPrediction?.riskPercentage || 'N/A'}%</td>
                    <td className="border border-gray-200 p-2">
                      {new Date(assessment.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredAssessments().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No assessments found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
