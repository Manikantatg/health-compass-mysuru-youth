
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '../../types/assessment';
import { ChevronDown, ChevronUp, Download, User, School, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';

interface StudentCardProps {
  assessment: AssessmentData;
}

const StudentCard: React.FC<StudentCardProps> = ({ assessment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityScore = (activity: any): number => {
    if (typeof activity === 'object' && activity.days && activity.minutes) {
      return Math.min((activity.days * activity.minutes) / 60, 2);
    }
    return Math.min(Number(activity) || 0, 2);
  };

  const getIndicatorScore = (category: string): number => {
    switch (category) {
      case 'activity':
        const activities = assessment.physicalActivity;
        const totalActivity = getActivityScore(activities.yoga) + 
                            getActivityScore(activities.exercise) + 
                            getActivityScore(activities.outdoorGames);
        return Math.min(totalActivity / 3, 2);
      
      case 'diet':
        const healthy = (assessment.eatingHabits.fruits + assessment.eatingHabits.vegetables + 
                        assessment.eatingHabits.cereals + assessment.eatingHabits.pulses) / 4;
        const unhealthy = (assessment.eatingHabits.snacks + assessment.eatingHabits.sweets + 
                          assessment.eatingHabits.beverages) / 3;
        return Math.max(0, 2 - (unhealthy - healthy));
      
      case 'screen':
        const screenTime = assessment.sedentaryBehavior.tvTime + assessment.sedentaryBehavior.mobileTime;
        return Math.max(0, 2 - screenTime);
      
      case 'sleep':
        const sleepIssues = (assessment.sleepQuality.difficultyFallingAsleep + 
                           assessment.sleepQuality.wakeUpDuringSleep) / 2;
        return Math.max(0, 2 - sleepIssues);
      
      case 'mental':
        return Math.max(0, 2 - assessment.mentalHealth.bodyPerception);
      
      default:
        return 1;
    }
  };

  const getIndicatorIcon = (category: string, score: number) => {
    const getColor = (score: number) => score >= 1.5 ? 'text-green-600' : score >= 1 ? 'text-yellow-600' : 'text-red-600';
    
    switch (category) {
      case 'activity': return <span className={`text-lg ${getColor(score)}`}>🏃‍♂️</span>;
      case 'diet': return <span className={`text-lg ${getColor(score)}`}>🍎</span>;
      case 'screen': return <span className={`text-lg ${getColor(score)}`}>📱</span>;
      case 'sleep': return <span className={`text-lg ${getColor(score)}`}>😴</span>;
      case 'mental': return <span className={`text-lg ${getColor(score)}`}>😊</span>;
      default: return null;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generateHealthReportPDF(assessment);
      toast({
        title: "Success!",
        description: "PDF report downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive"
      });
    }
  };

  const riskLevel = assessment.aiPrediction?.riskLevel || 'Medium';

  return (
    <motion.div
      layout
      className="h-fit"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${getRiskColor(riskLevel)}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">{assessment.socioDemographic.name}</CardTitle>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{assessment.socioDemographic.age}y, {assessment.socioDemographic.gender}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <School className="h-3 w-3" />
                  <span>Class {assessment.socioDemographic.class}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getRiskColor(riskLevel)} font-semibold`}>
              {riskLevel} Risk
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* AI Summary */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">AI Analysis:</p>
            <p className="text-xs text-blue-700">
              {assessment.aiPrediction?.explanation || 'Assessment completed successfully.'}
            </p>
          </div>

          {/* Mini Indicators */}
          <div className="grid grid-cols-5 gap-2">
            {['activity', 'diet', 'screen', 'sleep', 'mental'].map((category) => {
              const score = getIndicatorScore(category);
              return (
                <div key={category} className="text-center">
                  {getIndicatorIcon(category, score)}
                  <div className="text-xs mt-1 font-medium capitalize">{category}</div>
                  <div className={`text-xs ${score >= 1.5 ? 'text-green-600' : score >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score.toFixed(1)}/2
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <span>{isExpanded ? 'See Less' : 'See More'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t">
                  {/* Detailed Scores */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">BMI:</span> {assessment.bmi.toFixed(1)}
                    </div>
                    <div>
                      <span className="font-medium">Risk %:</span> {assessment.aiPrediction?.riskPercentage || 50}%
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Assessment Date:</span> {new Date(assessment.completedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {assessment.aiPrediction?.recommendations && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-800 mb-2">Top Recommendations:</p>
                      <ul className="text-xs text-purple-700 space-y-1">
                        {assessment.aiPrediction.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Download PDF Button */}
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentCard;
