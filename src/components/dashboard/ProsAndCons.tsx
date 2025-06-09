import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProsAndConsProps {
  riskLevel: string;
  bmi: number;
  age: number;
}

const ProsAndCons: React.FC<ProsAndConsProps> = ({ riskLevel, bmi, age }) => {
  const getProsAndCons = (riskLevel: string, bmi: number) => {
    if (riskLevel === 'Low') {
      return {
        pros: [
          "You're maintaining a healthy weight range - excellent work!",
          "Your current lifestyle supports good health habits",
          "Your physical activity levels are well-balanced",
          "Lower risk of developing obesity-related health issues",
          "You're setting a positive example for your peers"
        ],
        cons: [
          "Don't become complacent - consistency is key for long-term health",
          "Monitor screen time to prevent sedentary habits from developing",
          "Still need to be mindful of occasional junk food intake",
          "Ensure you're getting adequate sleep for your age group",
          "Peer pressure might influence eating habits negatively"
        ]
      };
    } else if (riskLevel === 'Medium') {
      return {
        pros: [
          "You're aware of your health status - awareness is the first step",
          "Small changes can make a significant difference at this stage",
          "You have the opportunity to prevent future health complications",
          "Your young age makes it easier to build healthy habits",
          "There's plenty of room for positive improvement"
        ],
        cons: [
          "Risk of progressing to higher obesity risk without intervention",
          "Current eating habits may need significant adjustment",
          "Sedentary behavior patterns need immediate attention",
          "Increased risk of developing confidence and social issues",
          "Higher chance of needing medical intervention later"
        ]
      };
    } else {
      return {
        pros: [
          "Early identification allows for immediate intervention",
          "Healthcare support can be accessed promptly",
          "Your young age gives you the best chance for improvement",
          "Family support can be mobilized for lifestyle changes",
          "Clear goals and targets can be set for health improvement"
        ],
        cons: [
          "Immediate lifestyle changes are crucial and urgent",
          "Risk of developing serious health complications",
          "Potential impact on self-esteem and social interactions",
          "May require professional nutritional and medical guidance",
          "Time-sensitive situation requiring consistent commitment"
        ]
      };
    }
  };

  const { pros, cons } = getProsAndCons(riskLevel, bmi);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pros Section */}
      <Card className="bg-green-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
            <ThumbsUp className="h-8 w-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            ✓ Positive Aspects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pros.map((pro, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-green-800 font-medium text-sm leading-relaxed">{pro}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cons Section */}
      <Card className="bg-red-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
            <ThumbsDown className="h-8 w-8 text-red-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            ⚠ Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cons.map((con, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-red-800 font-medium text-sm leading-relaxed">{con}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProsAndCons;
