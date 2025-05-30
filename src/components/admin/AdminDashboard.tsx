
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Users, TrendingUp, Download, Search, Filter, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [editingAssessment, setEditingAssessment] = useState<AssessmentData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate() || new Date()
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

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    
    try {
      await deleteDoc(doc(db, 'assessments', assessmentId));
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
      toast({
        title: "Success",
        description: "Assessment deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assessment.",
        variant: "destructive"
      });
    }
  };

  const handleSaveAssessment = async () => {
    if (!editingAssessment) return;

    try {
      if (editingAssessment.id) {
        // Update existing assessment
        const { id, ...updateData } = editingAssessment;
        await updateDoc(doc(db, 'assessments', id), updateData);
        setAssessments(prev => prev.map(a => a.id === id ? editingAssessment : a));
        toast({
          title: "Success",
          description: "Assessment updated successfully."
        });
      } else {
        // Create new assessment
        const docRef = await addDoc(collection(db, 'assessments'), {
          ...editingAssessment,
          completedAt: new Date()
        });
        const newAssessment = { ...editingAssessment, id: docRef.id };
        setAssessments(prev => [newAssessment, ...prev]);
        toast({
          title: "Success",
          description: "Assessment created successfully."
        });
      }
      
      setEditingAssessment(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment.",
        variant: "destructive"
      });
    }
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
          HealthPredict Administration Panel - Website Data Control
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

      {/* CRUD Operations Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Assessment Data Management</CardTitle>
              <CardDescription>Full CRUD operations for website data control</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingAssessment({
                        userId: '',
                        socioDemographic: {
                          schoolName: '',
                          name: '',
                          age: 0,
                          gender: 'male',
                          class: '',
                          section: '',
                          height: 0,
                          weight: 0,
                          address: '',
                          hostelResident: false,
                          fatherName: '',
                          motherName: '',
                          fatherContact: '',
                          motherContact: '',
                          brothers: 0,
                          sisters: 0,
                          birthOrder: 0,
                          familyType: 'nuclear',
                          hasSiblings: 'no',
                          familyObesity: 'no',
                          familyDiabetes: 'no',
                          familyHypertension: 'no',
                          familyThyroid: 'no',
                          familyObesityHistory: false,
                          diabetesHistory: false,
                          bpHistory: false,
                          thyroidHistory: false
                        },
                        eatingHabits: {
                          cereals: 0,
                          pulses: 0,
                          vegetables: 0,
                          fruits: 0,
                          milkProducts: 0,
                          nonVeg: 0,
                          snacks: 0,
                          beverages: 0,
                          sweets: 0,
                          junkFood: 0,
                          softDrinks: 0,
                          energyDrinks: 0
                        },
                        physicalActivity: {
                          ptFrequency: 0,
                          ptDuration: 0,
                          participation: false,
                          yoga: 0,
                          exercise: 0,
                          indoorGames: 0,
                          outdoorGames: 0,
                          playAfterSchool: 0,
                          cycling: 0,
                          walking: 0,
                          dance: 0,
                          swimming: 0
                        },
                        sedentaryBehavior: {
                          tvTime: 0,
                          mobileTime: 0,
                          schoolReading: 0,
                          nonSchoolReading: 0,
                          indoorGamesTime: 0,
                          outdoorGamesTime: 0,
                          tuitionTime: 0,
                          homeworkTime: 0,
                          readingTime: 0,
                          gamingTime: 0,
                          musicTime: 0
                        },
                        mentalHealth: {
                          bodyPerception: 0,
                          bullyingExperience: false,
                          weightGoal: 'maintain',
                          bodyImageSelection: 1,
                          difficultyWalking: 0,
                          difficultyRunning: 0,
                          difficultySports: 0,
                          difficultyAttention: 0,
                          forgetThings: 0,
                          troubleKeepingUp: 0,
                          feelLonely: 0,
                          wantEatLess: 0,
                          mobilityIssues: 0
                        },
                        sleepQuality: {
                          difficultyFallingAsleep: 0,
                          wakeUpDuringSleep: 0,
                          wakeUpFromNoise: 0,
                          difficultyGettingBackToSleep: 0,
                          sleepinessInClasses: 0,
                          sleepHeadache: 0,
                          sleepIrritation: 0,
                          sleepLossOfInterest: 0,
                          sleepForgetfulness: 0,
                          bedtime: '',
                          wakeupTime: '',
                          sleepIssues: []
                        },
                        bmi: 0,
                        completedAt: new Date(),
                        aiPrediction: {
                          riskLevel: 'Medium',
                          riskPercentage: 0,
                          recommendations: [],
                          explanation: ''
                        }
                      } as AssessmentData);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAssessment?.id ? 'Edit Assessment' : 'Create New Assessment'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingAssessment?.id ? 'Update assessment data' : 'Add a new student assessment'}
                    </DialogDescription>
                  </DialogHeader>
                  {editingAssessment && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Student Name</Label>
                          <Input
                            id="name"
                            value={editingAssessment.socioDemographic.name}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                name: e.target.value
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="school">School Name</Label>
                          <Input
                            id="school"
                            value={editingAssessment.socioDemographic.schoolName}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                schoolName: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={editingAssessment.socioDemographic.age}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                age: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="class">Class</Label>
                          <Input
                            id="class"
                            value={editingAssessment.socioDemographic.class}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                class: e.target.value
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bmi">BMI</Label>
                          <Input
                            id="bmi"
                            type="number"
                            step="0.1"
                            value={editingAssessment.bmi}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              bmi: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fatherContact">Father's Contact</Label>
                          <Input
                            id="fatherContact"
                            value={editingAssessment.socioDemographic.fatherContact}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                fatherContact: e.target.value
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="motherContact">Mother's Contact</Label>
                          <Input
                            id="motherContact"
                            value={editingAssessment.socioDemographic.motherContact}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              socioDemographic: {
                                ...editingAssessment.socioDemographic,
                                motherContact: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSaveAssessment}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button onClick={exportData} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
            </div>
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
                  <th className="border border-gray-200 p-2 text-left">Date</th>
                  <th className="border border-gray-200 p-2 text-left">Actions</th>
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
                    <td className="border border-gray-200 p-2">
                      {new Date(assessment.completedAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAssessment(assessment);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAssessment(assessment.id!)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
