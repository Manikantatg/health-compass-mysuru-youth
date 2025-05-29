import React from 'react';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  riskLevel: string;
  riskPercentage: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, riskPercentage }) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-700';
      case 'medium':
        return 'text-yellow-700';
      case 'high':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-50 border-green-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'high':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskMessage = () => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return {
          title: 'Great job! 🎉',
          message: 'Your lifestyle choices are supporting healthy weight management.',
          tips: 'Keep up the good work with regular exercise and balanced nutrition!'
        };
      case 'medium':
        return {
          title: 'Room for improvement 💪',
          message: 'Some lifestyle adjustments could help reduce your risk.',
          tips: 'Focus on increasing physical activity and improving eating habits.'
        };
      case 'high':
        return {
          title: 'Time for action 🎯',
          message: 'Several risk factors have been identified that need attention.',
          tips: 'Consider consulting with a healthcare provider for personalized guidance.'
        };
      default:
        return {
          title: 'Assessment needed',
          message: 'Complete your assessment for personalized insights.',
          tips: ''
        };
    }
  };

  const riskInfo = getRiskMessage();

  return (
    <div className="space-y-6">
      {/* Risk Level Display */}
      <div className={`p-4 rounded-xl border-2 ${getRiskBgColor(riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Risk Level</h3>
            <p className={`text-2xl font-bold ${getRiskTextColor(riskLevel)}`}>
              {riskLevel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Risk Score</p>
            <p className={`text-2xl font-bold ${getRiskTextColor(riskLevel)}`}>
              {riskPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Risk Meter Visualization */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${riskPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${getRiskColor(riskLevel)}`}
        />
      </div>

      {/* Risk Information Card */}
      <div className={`p-4 rounded-lg border-2`} style={{ 
        backgroundColor: `${getRiskColor(riskLevel)}10`, 
        borderColor: `${getRiskColor(riskLevel)}40` 
      }}>
        <h4 className="font-bold text-lg mb-2">{riskInfo.title}</h4>
        <p className="text-sm mb-2">{riskInfo.message}</p>
        {riskInfo.tips && (
          <p className="text-xs text-gray-600 italic">{riskInfo.tips}</p>
        )}
      </div>

      {/* Risk Level Indicators */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Low Risk</span>
        <span>Medium Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
};

export default RiskMeter;
