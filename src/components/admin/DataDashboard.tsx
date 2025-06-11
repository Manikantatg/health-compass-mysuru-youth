import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AssessmentData } from '../../types/assessment';
import { Search, Filter, Download, Grid, List, Users, FileText, BarChart3, Scale, School } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumStudentCard from './PremiumStudentCard';
import { toast } from '@/components/ui/use-toast';

const DataDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [assessmentsData, setAssessmentsData] = useState<AssessmentData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const assessmentsRef = collection(db, 'assessments');
      const q = query(assessmentsRef, orderBy('timestamp', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentData[];

      setAssessments(data);
      setAssessmentsData(data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to fetch assessments. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch assessments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const handleDeleteAssessment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'assessments', id));
      setAssessments(prevAssessments => prevAssessments.filter(assessment => assessment.id !== id));
      setAssessmentsData(prevData => prevData.filter(assessment => assessment.id !== id));
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

  const handleFilter = useCallback((filters: {
    riskLevel?: string;
    gender?: string;
    school?: string;
  }) => {
    let filtered = [...assessments];

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter(
        assessment => assessment.aiPrediction?.riskLevel === filters.riskLevel
      );
    }

    if (filters.gender && filters.gender !== 'all') {
      filtered = filtered.filter(
        assessment => assessment.socioDemographic?.gender === filters.gender
      );
    }

    if (filters.school && filters.school !== 'all') {
      filtered = filtered.filter(
        assessment => assessment.socioDemographic?.schoolName === filters.school
      );
    }

    setAssessmentsData(filtered);
  }, [assessments]);

  const getRiskLevelStats = useCallback(() => {
    const stats = {
      high: 0,
      medium: 0,
      low: 0
    };

    assessments.forEach(assessment => {
      const riskLevel = assessment.aiPrediction?.riskLevel?.toLowerCase() || 'unknown';
      if (riskLevel in stats) {
        stats[riskLevel as keyof typeof stats]++;
      }
    });

    return stats;
  }, [assessments]);

  const riskLevelStats = getRiskLevelStats();

  const getFilteredAssessments = useCallback(() => {
    return assessmentsData.filter(assessment => {
      const matchesSearch = searchTerm === '' || 
        assessment.socioDemographic?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.socioDemographic?.schoolName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = filterRisk === 'all' || 
        assessment.aiPrediction?.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
      
      const matchesGender = filterGender === 'all' || 
        assessment.socioDemographic?.gender === filterGender;
        
      const matchesSchool = filterSchool === 'all' || 
        assessment.socioDemographic?.schoolName === filterSchool;

      return matchesSearch && matchesRisk && matchesGender && matchesSchool;
    });
  }, [assessmentsData, searchTerm, filterRisk, filterGender, filterSchool]);

  const filteredAssessments = getFilteredAssessments();
  const uniqueSchools = [...new Set(assessments.map(a => a.socioDemographic?.schoolName))].filter(Boolean);

  const exportData = useCallback(() => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      const csvContent = [
        ['Name', 'School', 'Age', 'Gender', 'BMI', 'Risk Level', 'Date'].join(','),
        ...filteredAssessments.map(assessment => [
          assessment.socioDemographic?.name || 'N/A',
          assessment.socioDemographic?.schoolName || 'N/A',
          assessment.socioDemographic?.age || 'N/A',
          assessment.socioDemographic?.gender || 'N/A',
          assessment.bmi || 'N/A',
          assessment.aiPrediction?.riskLevel || 'N/A',
          new Date(assessment.completedAt).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-assessment-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Data exported successfully."
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredAssessments, isExporting]);

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
            <p className="text-headline text-foreground">Loading Student Data</p>
            <p className="text-caption">Preparing health records...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-headline text-foreground">Error Loading Data</p>
            <p className="text-caption text-muted-foreground">{error}</p>
            <Button onClick={fetchAssessments} className="mt-4">
              Retry
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-hero text-foreground flex items-center space-x-3">
            <Users className="w-8 h-8 text-primary" />
            <span>Student Health Data</span>
          </h1>
          <p className="text-muted-foreground">View and manage student health assessment records</p>
        </motion.div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterRisk} onValueChange={(value) => {
            setFilterRisk(value);
            handleFilter({ riskLevel: value });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
              <SelectItem value="Medium">Medium Risk</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGender} onValueChange={(value) => {
            setFilterGender(value);
            handleFilter({ gender: value });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSchool} onValueChange={(value) => {
            setFilterSchool(value);
            handleFilter({ school: value });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {uniqueSchools.map((school) => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle and Export */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={exportData}
            disabled={isExporting}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
          </Button>
        </div>

        {/* Data Display */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAssessments.map((assessment) => (
            <PremiumStudentCard
              key={assessment.id}
              assessment={assessment}
              onDelete={() => handleDeleteAssessment(assessment.id!)}
            />
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No assessments found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDashboard;
