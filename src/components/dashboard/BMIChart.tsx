
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
    <Card>
      <CardHeader>
        <CardTitle>BMI Tracking</CardTitle>
        <CardDescription>
          Current BMI: {bmi} - {category.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* BMI Category Indicator */}
          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: category.color }}>
            <div>
              <p className="text-sm text-gray-600">BMI Category</p>
              <p className="text-xl font-semibold" style={{ color: category.color }}>
                {category.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">BMI Value</p>
              <p className="text-2xl font-bold">{bmi}</p>
            </div>
          </div>

          {/* BMI Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bmi" 
                  stroke={category.color} 
                  strokeWidth={2}
                  dot={{ fill: category.color, strokeWidth: 2, r: 4 }}
                />
                {/* Normal BMI range reference lines */}
                <ReferenceLine 
                  y={18.5} 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  label={{ value: "Underweight", position: "topLeft" }}
                />
                <ReferenceLine 
                  y={25} 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  label={{ value: "Normal", position: "topLeft" }}
                />
                <ReferenceLine 
                  y={30} 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  label={{ value: "Overweight", position: "topLeft" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Scale */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">BMI Categories</h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center p-2 rounded bg-blue-100 text-blue-800">
                Underweight<br/>{'< 18.5'}
              </div>
              <div className="text-center p-2 rounded bg-green-100 text-green-800">
                Normal<br/>18.5 - 24.9
              </div>
              <div className="text-center p-2 rounded bg-yellow-100 text-yellow-800">
                Overweight<br/>25 - 29.9
              </div>
              <div className="text-center p-2 rounded bg-red-100 text-red-800">
                Obese<br/>{'≥ 30'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIChart;
