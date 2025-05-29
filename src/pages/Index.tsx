
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Heart, Shield, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your health data to provide accurate obesity risk predictions.'
    },
    {
      icon: Activity,
      title: 'Comprehensive Assessment',
      description: 'Multi-dimensional evaluation covering lifestyle, eating habits, physical activity, and mental health factors.'
    },
    {
      icon: TrendingUp,
      title: 'Personalized Insights',
      description: 'Get tailored recommendations and actionable insights based on your unique health profile.'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your health data is encrypted and secure. We prioritize your privacy and data protection.'
    },
    {
      icon: Heart,
      title: 'Holistic Health View',
      description: 'Beyond BMI - we consider mental health, sleep quality, and social factors for complete wellness.'
    },
    {
      icon: Users,
      title: 'Evidence-Based',
      description: 'Built on scientific research specifically for children and adolescents in Mysuru and Chamarajanagar.'
    }
  ];

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            HealthPredict
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            AI-Powered Obesity Prediction Tool for Children and Adolescents
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Empowering young lives in Mysuru and Chamarajanagar to learn, thrive, and stay healthy 
            through data-driven health insights and personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Your Health Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">6-17</div>
              <p className="text-gray-600">Age Range (Years)</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">AI-Powered</div>
              <p className="text-gray-600">Risk Prediction</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">2 Districts</div>
              <p className="text-gray-600">Mysuru & Chamarajanagar</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose HealthPredict?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Account', description: 'Sign up with your school and personal information' },
              { step: '02', title: 'Complete Assessment', description: 'Fill out our comprehensive health questionnaire' },
              { step: '03', title: 'Get AI Analysis', description: 'Receive your personalized obesity risk prediction' },
              { step: '04', title: 'Follow Recommendations', description: 'Implement personalized health improvement strategies' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Preview */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Comprehensive Health Assessment
              </h2>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Our assessment covers 6 key areas of health to provide the most accurate predictions and recommendations.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-left">
                {[
                  'Personal & Family Information',
                  'Eating Habits & Nutrition',
                  'Physical Activity Levels',
                  'Screen Time & Sedentary Behavior',
                  'Mental Health & Body Image',
                  'Sleep Quality & Patterns'
                ].map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="text-blue-100">{area}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/auth')}
                className="mt-8 bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Powered by Swiss Design Thinking — "Empowering Young Lives to Learn, Thrive, and Stay Healthy."
          </p>
          <p className="text-sm text-gray-500">
            Developed for the health and wellness of students in Mysuru and Chamarajanagar districts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
