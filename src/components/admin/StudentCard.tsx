import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '../../types/assessment';
import { ChevronDown, ChevronUp, Download, User, School, Calendar, AlertTriangle, Activity, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateHealthReportPDF } from '../../utils/pdfExport';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface StudentCardProps {
  assessment: AssessmentData;
}

const StudentCard: React.FC<StudentCardProps> = ({ assessment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log("StudentCard assessment data:", assessment);
  console.log("AI Prediction:", assessment.aiPrediction);
  console.log("Risk Percentage:", assessment.aiPrediction?.riskPercentage);
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-200',
        progress: 'bg-green-500'
      };
      case 'medium': return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        progress: 'bg-yellow-500'
      };
      case 'high': return {
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200',
        progress: 'bg-red-500'
      };
      default: return {
        bg: 'bg-gray-50',
        text: 'text-gray-800',
        border: 'border-gray-200',
        progress: 'bg-gray-500'
      };
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

  const riskLevel = assessment.aiPrediction?.riskLevel || 'Unknown';
  const riskPercentage = assessment.aiPrediction?.riskPercentage || 0;
  const student = assessment.socioDemographic || {};
  const riskColors = getRiskColor(riskLevel);

  return (
    <motion.div
      layout
      className="h-fit"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${riskColors.bg} ${riskColors.border}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-gray-900">{assessment.socioDemographic?.name || 'Unknown Student'}</CardTitle>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{assessment.socioDemographic?.age ? `${assessment.socioDemographic.age}y` : 'N/A'}, {assessment.socioDemographic?.gender || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <School className="h-3 w-3" />
                  <span>{assessment.socioDemographic?.schoolName || 'Unknown School'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Class {assessment.socioDemographic?.class || 'N/A'} {assessment.socioDemographic?.section || ''}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Risk Level Display */}
          <div className={`p-4 rounded-lg ${riskColors.bg} border ${riskColors.border}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-5 w-5 ${riskColors.text}`} />
                <span className={`font-bold text-lg ${riskColors.text}`}>
                  {riskLevel} Risk Level ({riskPercentage}%)
                </span>
              </div>
              <span className={`font-bold text-lg ${riskColors.text}`}>
                {riskPercentage}%
              </span>
            </div>
            <Progress 
              value={riskPercentage} 
              className="h-2"
            />
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">BMI</p>
                <p className="text-lg font-bold text-gray-900">{assessment.bmi?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Assessment Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(assessment.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-2">AI Analysis</p>
            <p className="text-sm text-blue-700">
              {assessment.aiPrediction?.explanation || 'Assessment completed successfully.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex-1 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 bg-white hover:bg-gray-50"
          >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Read Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Read More
                </>
              )}
          </Button>
          </div>

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
                  {/* Recommendations */}
                  {assessment.aiPrediction?.recommendations && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-medium text-purple-800 mb-2">Top Recommendations</p>
                      <ul className="text-sm text-purple-700 space-y-2">
                        {assessment.aiPrediction.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {assessment.aiPrediction?.keyRiskFactors && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <p className="font-medium text-orange-800 mb-2">Key Risk Factors</p>
                      <ul className="text-sm text-orange-700 space-y-2">
                        {assessment.aiPrediction.keyRiskFactors.slice(0, 3).map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
