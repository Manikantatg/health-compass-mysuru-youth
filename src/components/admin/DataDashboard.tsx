
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AssessmentData } from '../../types/assessment';
import { Search, Filter, Download, Grid, List, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumStudentCard from './PremiumStudentCard';

const DataDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      const matchesSearch = searchTerm === '' || 
        assessment.socioDemographic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.socioDemographic.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = filterRisk === 'all' || 
        assessment.aiPrediction?.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
      
      const matchesGender = filterGender === 'all' || 
        assessment.socioDemographic.gender === filterGender;
        
      const matchesSchool = filterSchool === 'all' || 
        assessment.socioDemographic.schoolName === filterSchool;

      return matchesSearch && matchesRisk && matchesGender && matchesSchool;
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'School', 'Age', 'Gender', 'BMI', 'Risk Level', 'Date'].join(','),
      ...getFilteredAssessments().map(assessment => [
        assessment.socioDemographic.name,
        assessment.socioDemographic.schoolName,
        assessment.socioDemographic.age,
        assessment.socioDemographic.gender,
        assessment.bmi,
        assessment.aiPrediction?.riskLevel || 'N/A',
        new Date(assessment.completedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthPredict_Data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAssessments = getFilteredAssessments();
  const uniqueSchools = [...new Set(assessments.map(a => a.socioDemographic.schoolName))].filter(Boolean);

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
            <p className="text-headline text-slate-900 dark:text-slate-100">Loading Student Data</p>
            <p className="text-caption">Preparing health records...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-hero text-slate-900 dark:text-slate-100">
            Student Health Data
          </h1>
          <p className="text-subhead text-slate-600 dark:text-slate-400">
            Comprehensive overview of {filteredAssessments.length} student health assessments
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-premium">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-headline flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Filter & Search</span>
                  </CardTitle>
                  <CardDescription className="text-caption">
                    Refine your view of student health data
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button onClick={exportData} className="btn-secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus-ring"
                  />
                </div>

                {/* Risk Filter */}
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>

                {/* Gender Filter */}
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* School Filter */}
                <Select value={filterSchool} onValueChange={setFilterSchool}>
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {uniqueSchools.map(school => (
                      <SelectItem key={school} value={school}>{school}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRisk('all');
                    setFilterGender('all');
                    setFilterSchool('all');
                  }}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Cards */}
        {filteredAssessments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            {filteredAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PremiumStudentCard assessment={assessment} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium">
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-headline text-slate-900 dark:text-slate-100">
                      No students found
                    </h3>
                    <p className="text-body text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      Try adjusting your search filters or add new assessments to see student data here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DataDashboard;
