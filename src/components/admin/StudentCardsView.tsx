import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '../../types/assessment';
import { Search, Filter, Grid, List } from 'lucide-react';
import StudentCard from './StudentCard';
import { motion } from 'framer-motion';

interface StudentCardsViewProps {
  assessments: AssessmentData[];
}

const StudentCardsView: React.FC<StudentCardsViewProps> = ({ assessments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('none');
  const [filterGender, setFilterGender] = useState('none');
  const [filterClass, setFilterClass] = useState('none');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  console.log("StudentCardsView - Initial Assessments:", assessments);

  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      const matchesSearch = searchTerm === '' || 
        assessment.socioDemographic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.socioDemographic.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = filterRisk === 'none' || filterRisk === 'all' || 
        assessment.aiPrediction?.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
      
      const matchesGender = filterGender === 'none' || filterGender === 'all' || 
        assessment.socioDemographic.gender === filterGender;
        
      const matchesClass = filterClass === 'none' || filterClass === 'all' || 
        assessment.socioDemographic.class === filterClass;

      return matchesSearch && matchesRisk && matchesGender && matchesClass;
    });
  };

  const filteredAssessments = getFilteredAssessments();
  console.log("StudentCardsView - Filtered Assessments:", filteredAssessments);
  const uniqueClasses = [...new Set(assessments.map(a => a.socioDemographic.class))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Student Health Cards</CardTitle>
              <CardDescription>
                Interactive dashboard showing {filteredAssessments.length} student health assessments
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select risk level</SelectItem>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select gender</SelectItem>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select class</SelectItem>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterRisk('none');
              setFilterGender('none');
              setFilterClass('none');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Cards Grid */}
      {filteredAssessments.length > 0 ? (
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredAssessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <StudentCard assessment={assessment} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold mb-2">No students found</p>
              <p>Try adjusting your search filters or add new assessments.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentCardsView;
