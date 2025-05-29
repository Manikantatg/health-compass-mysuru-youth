
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

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
          "🎯 You're maintaining a healthy weight range - keep it up!",
          "💪 Your current lifestyle is supporting good health habits",
          "🏃‍♀️ Your physical activity levels are likely well-balanced",
          "🧠 Lower risk of developing obesity-related health issues",
          "✨ You're setting a great example for your peers"
        ],
        cons: [
          "⚠️ Don't become complacent - consistency is key",
          "📱 Monitor screen time to prevent sedentary habits",
          "🍕 Still need to be mindful of occasional junk food intake",
          "😴 Ensure you're getting adequate sleep for your age",
          "👥 Peer pressure might influence eating habits negatively"
        ]
      };
    } else if (riskLevel === 'Medium') {
      return {
        pros: [
          "🎯 You're aware of your health status - that's the first step!",
          "💡 Small changes can make a big difference at this stage",
          "🤝 You have the opportunity to prevent future health issues",
          "🌟 Your young age makes it easier to build healthy habits",
          "📈 Room for improvement means room for celebration!"
        ],
        cons: [
          "⚠️ Risk of progressing to higher obesity risk without action",
          "🍔 Current eating habits may need significant adjustment",
          "📺 Sedentary behavior patterns need immediate attention",
          "😰 Increased risk of developing confidence issues",
          "🏥 Higher chance of needing medical intervention later"
        ]
      };
    } else {
      return {
        pros: [
          "🚨 Early identification allows for immediate intervention",
          "👨‍⚕️ Healthcare support can be accessed promptly",
          "💪 Your young age gives you the best chance for improvement",
          "👪 Family support can be mobilized for lifestyle changes",
          "🎯 Clear goals and targets can be set for improvement"
        ],
        cons: [
          "⚠️ Immediate lifestyle changes are crucial and urgent",
          "🏥 Risk of developing serious health complications",
          "😔 Potential impact on self-esteem and social interactions",
          "💰 May require professional nutritional and medical guidance",
          "⏰ Time-sensitive situation requiring consistent commitment"
        ]
      };
    }
  };

  const { pros, cons } = getProsAndCons(riskLevel, bmi);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pros Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-green-100 rounded-full w-fit animate-bounce">
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ✨ The Good News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pros.map((pro, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200 hover:bg-green-100/50 transition-all duration-200 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-green-800 font-medium text-sm leading-relaxed">{pro}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cons Section */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-red-100 rounded-full w-fit animate-bounce">
            <ThumbsDown className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            ⚠️ Areas to Watch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cons.map((con, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200 hover:bg-red-100/50 transition-all duration-200 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
