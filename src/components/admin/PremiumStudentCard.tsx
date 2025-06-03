
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
          color: 'risk-low',
          bgColor: 'bg-green-500'
        };
      case 'medium': 
        return { 
          color: 'risk-medium',
          bgColor: 'bg-amber-500'
        };
      case 'high': 
        return { 
          color: 'risk-high',
          bgColor: 'bg-red-500'
        };
      default: 
        return { 
          color: 'bg-surface text-muted-foreground border-border',
          bgColor: 'bg-muted'
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
      <Card className="card-premium overflow-hidden group">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {assessment.socioDemographic.name}
                </h3>
                <p className="text-caption">
                  {assessment.socioDemographic.age}y, {assessment.socioDemographic.gender}
                </p>
              </div>
            </div>
            
            <Badge className={`${riskConfig.color} font-medium px-3 py-1 border`}>
              {riskLevel} Risk
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <School className="h-3 w-3" />
                <span>Class {assessment.socioDemographic.class}</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {assessment.socioDemographic.schoolName}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-caption">
                <Activity className="h-3 w-3" />
                <span>Health Score</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {healthScore}/100
              </p>
            </div>
          </div>

          {/* Health Score Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-caption">
              <span>Overall Health</span>
              <span>{healthScore}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${riskConfig.bgColor}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* BMI & Date */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm">
              <span className="text-caption">BMI: </span>
              <span className="font-medium text-foreground">
                {assessment.bmi.toFixed(1)} kg/m²
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-caption">
              <Calendar className="h-3 w-3" />
              <span>{new Date(assessment.completedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1"
            >
              <span>{isExpanded ? 'Less' : 'More'} Details</span>
              {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
            
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="flex-1"
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
              className="overflow-hidden border-t border-border"
            >
              <CardContent className="p-6 space-y-4 bg-surface">
                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Activity</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-caption">PT Frequency</span>
                        <span className="text-foreground">{assessment.physicalActivity.ptFrequency}/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-caption">Outdoor Games</span>
                        <span className="text-foreground">{getActivityDisplay(assessment.physicalActivity.outdoorGames)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Diet</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-caption">Fruits</span>
                        <span className="text-foreground">{assessment.eatingHabits.fruits}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-caption">Vegetables</span>
                        <span className="text-foreground">{assessment.eatingHabits.vegetables}/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                {assessment.aiPrediction?.explanation && (
                  <div className="p-4 bg-accent rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      AI Health Insights
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {assessment.aiPrediction.explanation}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-caption">Father's Contact</p>
                    <p className="text-xs font-medium text-foreground">
                      {assessment.socioDemographic.fatherContact || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption">Mother's Contact</p>
                    <p className="text-xs font-medium text-foreground">
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
