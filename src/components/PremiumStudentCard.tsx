import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Eye, Download, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AssessmentData } from '../types/assessment';

interface PremiumStudentCardProps {
  assessment: AssessmentData & { id: string };
  onView: (id: string) => void;
  onEdit: (assessment: AssessmentData & { id: string }) => void;
  onDownload: (assessment: AssessmentData & { id: string }) => void;
}

const PremiumStudentCard: React.FC<PremiumStudentCardProps> = ({
  assessment,
  onView,
  onEdit,
  onDownload
}) => {
  const bmi = assessment.bmi || 0;
  const riskLevel = assessment.aiPrediction?.riskLevel || 'Low';
  const riskPercentage = assessment.aiPrediction?.riskPercentage || 0;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Minus className="h-4 w-4" />;
      case 'low': return <TrendingDown className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const bmiInfo = getBMICategory(bmi);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      if (date instanceof Date) {
        return date.toLocaleDateString();
      }
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const getScoreColor = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {assessment.socioDemographic?.name || 'Student'}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {assessment.socioDemographic?.schoolName || 'School Name'} • 
              Class {assessment.socioDemographic?.class || 'N/A'}-{assessment.socioDemographic?.section || 'N/A'}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`${getRiskColor(riskLevel)} font-semibold`}>
            <div className="flex items-center gap-1">
              {getRiskIcon(riskLevel)}
              {riskLevel} Risk
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Student Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Age:</span>
            <span className="ml-2 text-gray-600">{assessment.socioDemographic?.age || 'N/A'} years</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="ml-2 text-gray-600 capitalize">{assessment.socioDemographic?.gender || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">BMI:</span>
            <span className={`ml-2 font-semibold ${bmiInfo.color}`}>
              {bmi.toFixed(1)} ({bmiInfo.category})
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Assessment Date:</span>
            <span className="ml-2 text-gray-600">{formatDate(assessment.completedAt)}</span>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Obesity Risk Level</span>
            <span className={`text-sm font-semibold ${getRiskColor(riskLevel).split(' ')[0]}`}>
              {riskPercentage}%
            </span>
          </div>
          <Progress value={riskPercentage} className="h-3" />
        </div>

        {/* Health Scores */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`font-semibold ${getScoreColor(assessment.scores?.eatingHabitsScore || 0)}`}>
              {(assessment.scores?.eatingHabitsScore || 0).toFixed(1)}/10
            </div>
            <div className="text-gray-600">Eating</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`font-semibold ${getScoreColor(assessment.scores?.physicalActivityScore || 0)}`}>
              {(assessment.scores?.physicalActivityScore || 0).toFixed(1)}/10
            </div>
            <div className="text-gray-600">Activity</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`font-semibold ${getScoreColor(assessment.scores?.sleepScore || 0)}`}>
              {(assessment.scores?.sleepScore || 0).toFixed(1)}/10
            </div>
            <div className="text-gray-600">Sleep</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`font-semibold ${getScoreColor(assessment.scores?.mentalHealthScore || 0)}`}>
              {(assessment.scores?.mentalHealthScore || 0).toFixed(1)}/10
            </div>
            <div className="text-gray-600">Mental</div>
          </div>
        </div>

        {/* Key Risk Factors */}
        {assessment.aiPrediction?.keyRiskFactors && assessment.aiPrediction.keyRiskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Risk Factors</h4>
            <div className="flex flex-wrap gap-1">
              {assessment.aiPrediction.keyRiskFactors.slice(0, 3).map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
              {assessment.aiPrediction.keyRiskFactors.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{assessment.aiPrediction.keyRiskFactors.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onView(assessment.id)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            onClick={() => onDownload(assessment)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumStudentCard;