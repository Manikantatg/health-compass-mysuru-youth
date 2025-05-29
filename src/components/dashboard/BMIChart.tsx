
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  bmi: number;
  age: number;
}

const BMIChart: React.FC<Props> = ({ bmi, age }) => {
  const bmiCategories = [
    { name: 'Underweight', value: 18.5, color: '#3B82F6' },
    { name: 'Normal', value: 24.9, color: '#10B981' },
    { name: 'Overweight', value: 29.9, color: '#F59E0B' },
    { name: 'Obese', value: 35, color: '#EF4444' }
  ];

  const data = bmiCategories.map(category => ({
    name: category.name,
    value: category.value,
    fill: category.color,
    opacity: bmi <= category.value ? 0.8 : 0.3
  }));

  const getCurrentCategory = () => {
    if (bmi < 18.5) return { name: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { name: 'Normal Weight', color: '#10B981' };
    if (bmi < 30) return { name: 'Overweight', color: '#F59E0B' };
    return { name: 'Obese', color: '#EF4444' };
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="space-y-4">
      {/* Current BMI Display */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-3xl font-bold">{bmi}</p>
        <p className={`text-lg font-semibold`} style={{ color: currentCategory.color }}>
          {currentCategory.name}
        </p>
        <p className="text-sm text-gray-600">Body Mass Index</p>
      </div>

      {/* BMI Categories Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              label={{ value: 'BMI Value', angle: -90, position: 'insideLeft' }}
              domain={[0, 40]}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'BMI Threshold']}
              labelStyle={{ color: '#374151' }}
            />
            <ReferenceLine 
              y={bmi} 
              stroke={currentCategory.color}
              strokeWidth={3}
              strokeDasharray="5 5"
              label={{ value: `Your BMI: ${bmi}`, position: 'topRight' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BMI Information */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">BMI Categories:</h4>
          <ul className="space-y-1">
            <li className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Underweight: &lt; 18.5</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Normal: 18.5 - 24.9</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Overweight: 25 - 29.9</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Obese: ≥ 30</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Important Note:</h4>
          <p className="text-xs text-gray-600">
            BMI is a screening tool and may not reflect body composition differences. 
            For growing children and adolescents, BMI percentiles are often more appropriate. 
            Consult with a healthcare provider for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMIChart;
