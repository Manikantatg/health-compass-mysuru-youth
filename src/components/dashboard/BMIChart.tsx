import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface BMIChartProps {
  bmi: number;
  age: number;
}

const BMIChart: React.FC<BMIChartProps> = ({ bmi, age }) => {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (bmi < 25) return { category: 'Normal', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (bmi < 30) return { category: 'Overweight', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { category: 'Obese', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const bmiInfo = getBMICategory(bmi);

  const getBMIRange = (age: number) => {
    // Simplified BMI ranges for children and adolescents
    if (age < 18) {
      return {
        underweight: { min: 0, max: 18.5 },
        normal: { min: 18.5, max: 25 },
        overweight: { min: 25, max: 30 },
        obese: { min: 30, max: 40 }
      };
    }
    return {
      underweight: { min: 0, max: 18.5 },
      normal: { min: 18.5, max: 25 },
      overweight: { min: 25, max: 30 },
      obese: { min: 30, max: 40 }
    };
  };

  const bmiRange = getBMIRange(age);
  const maxBMI = 40;
  const bmiPosition = (bmi / maxBMI) * 100;

  return (
    <Card className="bg-white border-2 border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">BMI Analysis</CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          Your current Body Mass Index status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* BMI Scale */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            {/* BMI Range Markers */}
            <div className="absolute inset-0 flex">
              <div className="w-1/4 bg-blue-100"></div>
              <div className="w-1/4 bg-green-100"></div>
              <div className="w-1/4 bg-yellow-100"></div>
              <div className="w-1/4 bg-red-100"></div>
            </div>

            {/* BMI Indicator */}
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${bmiPosition}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 bottom-0 w-1 bg-black transform -translate-x-1/2"
            />
          </div>

          {/* BMI Categories */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>

          {/* Current BMI Status */}
          <div className={`p-4 rounded-xl border-2 ${bmiInfo.bgColor} ${bmiInfo.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current BMI</h3>
                <p className={`text-2xl font-bold ${bmiInfo.textColor}`}>
                  {bmi.toFixed(1)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Category</p>
                <p className={`text-lg font-bold ${bmiInfo.textColor}`}>
                  {bmiInfo.category}
                </p>
              </div>
            </div>
          </div>

          {/* BMI Range Information */}
          <div className="text-sm text-gray-600">
            <p className="mb-2">BMI Ranges for Age {age}:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded">
                <span className="font-medium">Underweight:</span> &lt; 18.5
              </div>
              <div className="p-2 bg-green-50 rounded">
                <span className="font-medium">Normal:</span> 18.5 - 24.9
              </div>
              <div className="p-2 bg-yellow-50 rounded">
                <span className="font-medium">Overweight:</span> 25 - 29.9
              </div>
              <div className="p-2 bg-red-50 rounded">
                <span className="font-medium">Obese:</span> ≥ 30
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIChart;
