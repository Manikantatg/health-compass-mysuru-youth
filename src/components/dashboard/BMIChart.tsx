
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BMIChartProps {
  bmi: number;
  age: number;
}

const BMIChart: React.FC<BMIChartProps> = ({ bmi, age }) => {
  // BMI percentile data for children (simplified)
  const getBMICategory = (bmi: number, age: number) => {
    // Simplified BMI categories for children
    if (age < 18) {
      if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
      if (bmi < 25) return { category: 'Normal', color: '#10b981' };
      if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
      return { category: 'Obese', color: '#ef4444' };
    }
    
    // Adult BMI categories
    if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { category: 'Normal', color: '#10b981' };
    if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
    return { category: 'Obese', color: '#ef4444' };
  };

  const category = getBMICategory(bmi, age);

  // Sample data for BMI tracking over time
  const data = [
    { month: 'Jan', bmi: bmi - 2 },
    { month: 'Feb', bmi: bmi - 1.5 },
    { month: 'Mar', bmi: bmi - 1 },
    { month: 'Apr', bmi: bmi - 0.5 },
    { month: 'May', bmi: bmi },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          BMI Analysis ✨
        </h3>
        <p className="text-gray-600 text-sm">
          Current BMI: {bmi} - {category.category}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* BMI Category Indicator */}
        <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-dashed animate-pulse" style={{ borderColor: category.color }}>
          <div>
            <p className="text-sm text-gray-600 font-medium">BMI Category</p>
            <p className="text-2xl font-bold animate-bounce" style={{ color: category.color }}>
              {category.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">BMI Value</p>
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {bmi}
            </p>
          </div>
        </div>

        {/* BMI Chart */}
        <div className="h-64 bg-white/50 backdrop-blur-sm rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#6366f1" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#6366f1" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e1b4b',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bmi" 
                stroke={category.color} 
                strokeWidth={3}
                dot={{ fill: category.color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: category.color, strokeWidth: 2 }}
              />
              {/* Normal BMI range reference lines */}
              <ReferenceLine 
                y={18.5} 
                stroke="#94a3b8" 
                strokeDasharray="5 5" 
                label={{ value: "Underweight", position: "top" }}
              />
              <ReferenceLine 
                y={25} 
                stroke="#94a3b8" 
                strokeDasharray="5 5" 
                label={{ value: "Normal", position: "top" }}
              />
              <ReferenceLine 
                y={30} 
                stroke="#94a3b8" 
                strokeDasharray="5 5" 
                label={{ value: "Overweight", position: "top" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BMI Scale */}
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-gray-800">BMI Categories 📊</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 transform hover:scale-105 transition-transform duration-200">
              <div className="font-bold">Underweight</div>
              <div className="text-xs opacity-75">{'< 18.5'}</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-800 transform hover:scale-105 transition-transform duration-200">
              <div className="font-bold">Normal</div>
              <div className="text-xs opacity-75">18.5 - 24.9</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 transform hover:scale-105 transition-transform duration-200">
              <div className="font-bold">Overweight</div>
              <div className="text-xs opacity-75">25 - 29.9</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-800 transform hover:scale-105 transition-transform duration-200">
              <div className="font-bold">Obese</div>
              <div className="text-xs opacity-75">{'≥ 30'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMIChart;
