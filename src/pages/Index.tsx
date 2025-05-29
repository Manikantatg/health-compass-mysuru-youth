
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Heart, Shield, TrendingUp, Users, CheckCircle, BarChart, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your health data to provide accurate obesity risk predictions with scientific precision.'
    },
    {
      icon: Activity,
      title: 'Comprehensive Assessment',
      description: 'Multi-dimensional evaluation covering lifestyle, eating habits, physical activity, and mental health factors for complete health profiling.'
    },
    {
      icon: TrendingUp,
      title: 'Personalized Insights',
      description: 'Get tailored recommendations and actionable insights based on your unique health profile and regional health patterns.'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your health data is encrypted and secure. We prioritize your privacy and data protection with enterprise-grade security.'
    },
    {
      icon: Heart,
      title: 'Holistic Health View',
      description: 'Beyond BMI - we consider mental health, sleep quality, and social factors for complete wellness assessment.'
    },
    {
      icon: Users,
      title: 'Evidence-Based',
      description: 'Built on scientific research specifically for children and adolescents in Mysuru and Chamarajanagar regions.'
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "Early identification of health risks" },
    { icon: BarChart, text: "Data-driven health recommendations" },
    { icon: Clock, text: "Quick 5-minute assessment" },
    { icon: Award, text: "Certified by health professionals" }
  ];

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="professional-gradient text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              HealthPredict
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium">
              AI-Powered Obesity Prediction Tool for Children and Adolescents
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Empowering young lives in Mysuru and Chamarajanagar to learn, thrive, and stay healthy 
              through evidence-based health insights and personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
              >
                Start Health Assessment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold"
              >
                Healthcare Login
              </Button>
            </div>

            {/* Benefits Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-blue-100">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-2 border-blue-100 hover:border-blue-200 transition-colors animate-scale-in">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-blue-900 mb-2">6-17</div>
                <p className="text-gray-600 font-medium">Age Range (Years)</p>
                <p className="text-sm text-gray-500 mt-1">Comprehensive coverage for all school-going children</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-green-100 hover:border-green-200 transition-colors animate-scale-in">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-green-700 mb-2">AI-Powered</div>
                <p className="text-gray-600 font-medium">Risk Prediction</p>
                <p className="text-sm text-gray-500 mt-1">Advanced algorithms for accurate health assessment</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-purple-100 hover:border-purple-200 transition-colors animate-scale-in">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-purple-700 mb-2">2 Districts</div>
                <p className="text-gray-600 font-medium">Mysuru & Chamarajanagar</p>
                <p className="text-sm text-gray-500 mt-1">Tailored for regional health patterns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 accent-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthPredict?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive health assessment backed by scientific research and advanced AI technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 animate-fade-in">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-700" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Create Account', description: 'Sign up with your school and personal information securely' },
              { step: '02', title: 'Complete Assessment', description: 'Fill out our comprehensive health questionnaire in 5 minutes' },
              { step: '03', title: 'Get AI Analysis', description: 'Receive your personalized obesity risk prediction instantly' },
              { step: '04', title: 'Follow Recommendations', description: 'Implement personalized health improvement strategies' }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 animate-float">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Preview */}
      <div className="py-16 professional-gradient">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Comprehensive Health Assessment
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Our assessment covers 6 key areas of health to provide the most accurate predictions and recommendations.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 text-left">
                  {[
                    'Personal & Family Information',
                    'Eating Habits & Nutrition',
                    'Physical Activity Levels',
                    'Screen Time & Sedentary Behavior',
                    'Mental Health & Body Image',
                    'Sleep Quality & Patterns'
                  ].map((area, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-sm">{area}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="mt-12 bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  Start Assessment Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 mb-4 text-lg">
            Powered by Swiss Design Thinking — <span className="font-semibold">"Empowering Young Lives to Learn, Thrive, and Stay Healthy."</span>
          </p>
          <p className="text-sm text-gray-400">
            Developed for the health and wellness of students in Mysuru and Chamarajanagar districts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
