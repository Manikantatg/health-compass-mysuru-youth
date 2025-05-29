import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Activity, Heart, Clock, TrendingUp } from 'lucide-react';

interface HealthSummaryProps {
  assessmentData: {
    socioDemographic: {
      name: string;
      age: number;
    };
    bmi: number;
    aiPrediction: {
      riskLevel: string;
      explanation: string;
      recommendations: string[];
    };
  };
}

const HealthSummary: React.FC<HealthSummaryProps> = ({ assessmentData }) => {
  const { socioDemographic, bmi, aiPrediction } = assessmentData;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const bmiInfo = getBMICategory(bmi);

  const messages = [
    {
      type: 'greeting',
      content: `Hi ${socioDemographic.name}! We've reviewed your health assessment.`,
      icon: Brain,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'bmi',
      content: `Your BMI is ${bmi.toFixed(1)} (${bmiInfo.category}). ${bmiInfo.category === 'Normal' ? 'Great job maintaining a healthy weight!' : "Let's work on improving this together!"}`,
      icon: Activity,
      color: bmiInfo.bg,
      iconColor: bmiInfo.color
    },
    {
      type: 'risk',
      content: `Your health risk level is ${aiPrediction.riskLevel}. ${aiPrediction.explanation}`,
      icon: Heart,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      type: 'activity',
      content: `Based on your activity levels, try to aim for 60 minutes of physical activity daily.`,
      icon: Clock,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'tip',
      content: `Here's a quick tip: ${aiPrediction.recommendations[0]}`,
      icon: TrendingUp,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <Card className="border-2 border-blue-200 bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start space-x-3"
            >
              <div className={`p-2 rounded-full ${message.color}`}>
                <message.icon className={`h-5 w-5 ${message.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary; 