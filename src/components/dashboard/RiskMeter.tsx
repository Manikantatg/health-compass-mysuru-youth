
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskPercentage: number;
}

const RiskMeter: React.FC<Props> = ({ riskLevel, riskPercentage }) => {
  const data = [
    { name: 'Risk', value: riskPercentage },
    { name: 'Safe', value: 100 - riskPercentage }
  ];

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const colors = [getRiskColor(), '#E5E7EB'];

  const getRiskMessage = () => {
    switch (riskLevel) {
      case 'Low':
        return {
          title: 'Great job! 🎉',
          message: 'Your lifestyle choices are supporting healthy weight management.',
          tips: 'Keep up the good work with regular exercise and balanced nutrition!'
        };
      case 'Medium':
        return {
          title: 'Room for improvement 💪',
          message: 'Some lifestyle adjustments could help reduce your risk.',
          tips: 'Focus on increasing physical activity and improving eating habits.'
        };
      case 'High':
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
    <div className="space-y-4">
      {/* Risk Meter Visualization */}
      <div className="relative">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: getRiskColor() }}>
              {riskPercentage}%
            </p>
            <p className={`text-lg font-semibold`} style={{ color: getRiskColor() }}>
              {riskLevel} Risk
            </p>
          </div>
        </div>
      </div>

      {/* Risk Information Card */}
      <div className={`p-4 rounded-lg border-2`} style={{ 
        backgroundColor: `${getRiskColor()}10`, 
        borderColor: `${getRiskColor()}40` 
      }}>
        <h4 className="font-bold text-lg mb-2">{riskInfo.title}</h4>
        <p className="text-sm mb-2">{riskInfo.message}</p>
        {riskInfo.tips && (
          <p className="text-xs text-gray-600 italic">{riskInfo.tips}</p>
        )}
      </div>

      {/* Risk Level Indicators */}
      <div className="flex justify-between text-xs">
        <div className="text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className={riskLevel === 'Low' ? 'font-bold' : ''}>Low</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          <span className={riskLevel === 'Medium' ? 'font-bold' : ''}>Medium</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
          <span className={riskLevel === 'High' ? 'font-bold' : ''}>High</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
