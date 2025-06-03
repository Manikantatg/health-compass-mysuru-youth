
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '../../types/assessment';
import { ChevronDown, ChevronUp, Download, User, School, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';

interface PremiumStudentCardProps {
  assessment: AssessmentData;
  viewMode?: 'grid' | 'list';
}

const PremiumStudentCard: React.FC<PremiumStudentCardProps> = ({ assessment, viewMode = 'grid' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': 
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          progress: 'bg-emerald-500'
        };
      case 'medium': 
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
          dot: 'bg-amber-500',
          progress: 'bg-amber-500'
        };
      case 'high': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
          dot: 'bg-red-500',
          progress: 'bg-red-500'
        };
      default: 
        return { 
          color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
          dot: 'bg-slate-500',
          progress: 'bg-slate-500'
        };
    }
  };

  const getHealthScore = (): number => {
    const { physicalActivity, eatingHabits, sleepQuality, mentalHealth } = assessment;
    
    // Calculate activity score (0-25)
    const activityScore = Math.min((physicalActivity.ptFrequency * 5), 25);
    
    // Calculate diet score (0-25)
    const healthyFoods = (eatingHabits.fruits + eatingHabits.vegetables) / 2;
    const dietScore = Math.min(healthyFoods * 5, 25);
    
    // Calculate sleep score (0-25)
    const sleepScore = Math.max(0, 25 - (sleepQuality.difficultyFallingAsleep * 5));
    
    // Calculate mental health score (0-25)
    const mentalScore = Math.max(0, 25 - (mentalHealth.bodyPerception * 5));
    
    return Math.round(activityScore + dietScore + sleepScore + mentalScore);
  };

  // Helper function to safely display activity values
  const getActivityDisplay = (activity: any): string => {
    if (typeof activity === 'number') {
      return `${activity}h/week`;
    }
    if (typeof activity === 'object' && activity !== null && 'days' in activity && 'minutes' in activity) {
      const totalHours = (activity.days * activity.minutes) / 60;
      return `${totalHours.toFixed(1)}h/week`;
    }
    return '0h/week';
  };

  const handleDownloadPDF = async () => {
    try {
      await generateHealthReportPDF(assessment);
      toast({
        title: "Success",
        description: "Health report downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive"
      });
    }
  };

  const riskLevel = assessment.aiPrediction?.riskLevel || 'Medium';
  const riskConfig = getRiskConfig(riskLevel);
  const healthScore = getHealthScore();

  return (
    <motion.div
      layout
      className="h-fit"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`card-premium border-l-4 border-l-${riskConfig.dot.replace('bg-', '')} overflow-hidden group`}>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {assessment.socioDemographic.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {assessment.socioDemographic.age}y, {assessment.socioDemographic.gender}
                </p>
              </div>
            </div>
            
            <Badge className={`${riskConfig.color} font-medium px-3 py-1`}>
              {riskLevel} Risk
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <School className="h-3 w-3" />
                <span>Class {assessment.socioDemographic.class}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {assessment.socioDemographic.schoolName}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <Activity className="h-3 w-3" />
                <span>Health Score</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {healthScore}/100
              </p>
            </div>
          </div>

          {/* Health Score Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Overall Health</span>
              <span>{healthScore}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${riskConfig.progress}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* BMI & Date */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <span className="text-slate-500 dark:text-slate-400">BMI: </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {assessment.bmi.toFixed(1)} kg/m²
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>{new Date(assessment.completedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 btn-ghost text-xs"
            >
              <span>{isExpanded ? 'Less' : 'More'} Details</span>
              {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
            
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="flex-1 btn-primary text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>PDF</span>
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-slate-200 dark:border-slate-700"
            >
              <CardContent className="p-6 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Activity</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">PT Frequency</span>
                        <span className="text-slate-900 dark:text-slate-100">{assessment.physicalActivity.ptFrequency}/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Outdoor Games</span>
                        <span className="text-slate-900 dark:text-slate-100">{getActivityDisplay(assessment.physicalActivity.outdoorGames)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Diet</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Fruits</span>
                        <span className="text-slate-900 dark:text-slate-100">{assessment.eatingHabits.fruits}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Vegetables</span>
                        <span className="text-slate-900 dark:text-slate-100">{assessment.eatingHabits.vegetables}/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                {assessment.aiPrediction?.explanation && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      AI Health Insights
                    </h4>
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                      {assessment.aiPrediction.explanation}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Father's Contact</p>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      {assessment.socioDemographic.fatherContact || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mother's Contact</p>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      {assessment.socioDemographic.motherContact || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default PremiumStudentCard;
