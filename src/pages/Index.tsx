import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Heart, Shield, TrendingUp, Users, CheckCircle, BarChart, Clock, Award, Sparkles, Star, Target, Zap, Mail, MapPin, Lock, Smartphone, MessageSquare, Sparkles as SparklesIcon, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mascot Components
const SpeedMascot = () => (
  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
    </div>
  </div>
);

const PrivacyMascot = () => (
  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-green-300 rounded-full"></div>
    </div>
  </div>
);

const BrainMascot = () => (
  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-purple-300 rounded-full"></div>
    </div>
  </div>
);

const ProgressMascot = () => (
  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-orange-300 rounded-full"></div>
    </div>
  </div>
);

const AnalyticsMascot = () => (
  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-indigo-300 rounded-full"></div>
    </div>
  </div>
);

const ManagementMascot = () => (
  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-pink-300 rounded-full"></div>
    </div>
  </div>
);

const DetectionMascot = () => (
  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-red-300 rounded-full"></div>
    </div>
  </div>
);

const SuccessMascot = () => (
  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
    </div>
  </div>
);

// Additional Mascot Components
const SparkleMascot = () => (
  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
    </div>
  </div>
);

const RocketMascot = () => (
  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-red-300 rounded-full"></div>
    </div>
  </div>
);

const ChatMascot = () => (
  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
    </div>
  </div>
);

const QuestionMascot = () => (
  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-purple-300 rounded-full"></div>
    </div>
  </div>
);

const LocationMascot = () => (
  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-green-300 rounded-full"></div>
    </div>
  </div>
);

const StudentMascot = () => (
  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
    </div>
  </div>
);

const ParentMascot = () => (
  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-pink-300 rounded-full"></div>
    </div>
  </div>
);

const DoctorMascot = () => (
  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
    <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-red-300 rounded-full"></div>
    </div>
  </div>
);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const keyFeatures = [
    { icon: Zap, text: "5-min assessment", mascot: SpeedMascot },
    { icon: Shield, text: "100% private data", mascot: PrivacyMascot },
    { icon: Brain, text: "AI trained for local youth", mascot: BrainMascot },
    { icon: Users, text: "Built for ages 6–17", mascot: ManagementMascot },
    { icon: MapPin, text: "Made for Karnataka", mascot: LocationMascot },
    { icon: CheckCircle, text: "Backed by doctors", mascot: SuccessMascot }
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Smart predictions using advanced machine learning',
      mascot: BrainMascot
    },
    {
      icon: Activity,
      title: 'Complete Health Profiling',
      description: 'Covers physical, mental, and lifestyle health',
      mascot: AnalyticsMascot
    },
    {
      icon: TrendingUp,
      title: 'Personalized Insights',
      description: 'Custom tips based on your responses',
      mascot: SparkleMascot
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data = your control. Never shared.',
      mascot: PrivacyMascot
    },
    {
      icon: MapPin,
      title: 'Built for Local Youth',
      description: 'Designed for Karnataka\'s youth',
      mascot: ManagementMascot
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Sign Up', description: 'Quick & easy registration', mascot: RocketMascot },
    { step: '02', title: 'Answer Qs', description: 'Just 5 minutes', mascot: BrainMascot },
    { step: '03', title: 'Get Score', description: 'Instant risk assessment', mascot: SuccessMascot },
    { step: '04', title: 'Smart Tips', description: 'Personalized recommendations', mascot: SparkleMascot }
  ];

  const healthDomains = [
    { text: 'Personal & Family Background', mascot: ManagementMascot },
    { text: 'Eating Habits', mascot: BrainMascot },
    { text: 'Physical Activity', mascot: SpeedMascot },
    { text: 'Screen Time & Behavior', mascot: ProgressMascot },
    { text: 'Mental Health & Body Image', mascot: PrivacyMascot },
    { text: 'Sleep Quality', mascot: SuccessMascot }
  ];

  const testimonials = [
    {
      quote: "Used it at school today. My health score was a surprise— but super helpful!",
      author: "Student",
      location: "Mysuru",
      mascot: StudentMascot
    },
    {
      quote: "Loved how fast and private it was. No judgement at all!",
      author: "Parent",
      location: "Mysuru",
      mascot: ParentMascot
    },
    {
      quote: "We now detect obesity risk early at our school. Game changer!",
      author: "Doctor",
      location: "Chamarajanagar",
      mascot: DoctorMascot
    }
  ];

  const faqs = [
    {
      question: "Is it free?",
      answer: "Yes, totally free!",
      mascot: SuccessMascot
    },
    {
      question: "Do I need my parents?",
      answer: "For under 13, yes. For older teens, optional.",
      mascot: ParentMascot
    },
    {
      question: "How do you protect my data?",
      answer: "Enterprise-grade encryption. Your data = your control.",
      mascot: PrivacyMascot
    },
    {
      question: "What will I get?",
      answer: "Instant health risk score + custom tips for better health.",
      mascot: BrainMascot
    }
  ];

  const studentFeatures = [
    {
      icon: Clock,
      title: "5-Min Assessment",
      description: "Quick, easy questions designed for your age group",
      mascot: SpeedMascot
    },
    {
      icon: Shield,
      title: "100% Private",
      description: "Your data stays private and secure",
      mascot: PrivacyMascot
    },
    {
      icon: Brain,
      title: "Smart Insights",
      description: "Get personalized health tips and recommendations",
      mascot: BrainMascot
    },
    {
      icon: Activity,
      title: "Track Progress",
      description: "Monitor your health improvements over time",
      mascot: ProgressMascot
    }
  ];

  const adminFeatures = [
    {
      icon: BarChart,
      title: "School Analytics",
      description: "Comprehensive health insights for your entire school",
      mascot: AnalyticsMascot
    },
    {
      icon: Users,
      title: "Bulk Management",
      description: "Easily manage multiple students and classes",
      mascot: ManagementMascot
    },
    {
      icon: Target,
      title: "Early Detection",
      description: "Identify health risks before they become serious",
      mascot: DetectionMascot
    },
    {
      icon: Award,
      title: "Success Tracking",
      description: "Measure the impact of health interventions",
      mascot: SuccessMascot
    }
  ];

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-32 relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left Column - Text Content */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-8"
              >
                <span className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 border border-white/20 flex items-center gap-2 group hover:bg-white/20 transition-all duration-300">
                  <SparkleMascot />
                  AI-Powered Health Assessment
                </span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight"
              >
                Scan Your Health in 5 Mins
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-blue-100 mb-12 max-w-2xl leading-relaxed"
              >
                AI-powered insights for school kids in Mysuru & Chamarajanagar. Fast, private, and empowering.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6"
              >
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                  className="bg-white text-blue-900 hover:bg-gray-100 px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  <span className="flex items-center gap-2 relative">
                    Start Now
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-10 py-7 text-lg font-semibold rounded-2xl transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    For Schools & Doctors
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex items-center gap-8"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-500/20 backdrop-blur-sm"></div>
                  ))}
                </div>
                <p className="text-sm text-blue-100">
                  Trusted by 1000+ students in Karnataka
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[700px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl backdrop-blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Health Assessment Dashboard Preview" 
                className="w-full h-full object-cover rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Brain className="h-7 w-7 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">AI-Powered Analysis</p>
                    <p className="text-sm text-gray-500">Real-time health insights</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">100% Private</p>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-1/2 -right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">5-min Assessment</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* User Types Section */}
      <div className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Designed for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a student or administrator, we've got you covered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Student Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
                  <p className="text-gray-600">Ages 6-17</p>
                </div>
              </div>
              <div className="space-y-6">
                {studentFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const Mascot = feature.mascot;
                  return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {feature.title}
                          <Mascot />
                        </h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full mt-8 bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Start Your Assessment
              </Button>
            </motion.div>

            {/* Admin Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">For Administrators</h3>
                  <p className="text-gray-600">Schools & Health Authorities</p>
                </div>
            </div>
              <div className="space-y-6">
                {adminFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const Mascot = feature.mascot;
                return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-purple-700" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {feature.title}
                          <Mascot />
                        </h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                  </div>
                );
              })}
            </div>
              <Button 
                onClick={() => navigate('/contact')}
                className="w-full mt-8 bg-purple-600 text-white hover:bg-purple-700 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Request Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto"
          >
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const Mascot = feature.mascot;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="h-full p-8 bg-gray-50 rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-blue-700" />
                    </div>
                    <p className="text-base text-gray-600 font-medium flex items-center gap-2">
                      {feature.text}
                      <Mascot />
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-gray-900 mb-20"
          >
            How It Works
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto"
          >
            {howItWorks.map((item, index) => {
              const Mascot = item.mascot;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center group relative"
                >
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                  )}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300 relative">
                    {item.step}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center justify-center gap-2">
                    {item.title}
                    <Mascot />
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why It's Cool ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Health assessment that feels empowering, not clinical
            </p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const Mascot = benefit.mascot;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 rounded-3xl bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-blue-700" />
                        </div>
                        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                          {benefit.title}
                          <Mascot />
                        </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed text-base">
                        {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-gray-900 mb-20"
          >
            What People Say 💬
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <CardContent className="p-10">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">{testimonial.emoji}</span>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{testimonial.author}</p>
                          <p className="text-gray-500">{testimonial.location}</p>
                        </div>
                </div>
                      <p className="text-xl text-gray-600 mb-8 flex-grow leading-relaxed">"{testimonial.quote}"</p>
              </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-gray-900 mb-20"
          >
            Got Questions? ❓
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl mt-1">{faq.emoji}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
                  ))}
          </motion.div>
        </div>
                </div>
                
      {/* Final CTA Section */}
      <div className="py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold text-white mb-12">
              Ready to Scan Your Health?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                className="bg-white text-blue-900 hover:bg-gray-100 px-12 py-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="flex items-center gap-3 relative">
                  Start Now
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-12 py-8 text-lg font-semibold rounded-2xl transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  For Schools & Doctors
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                </Button>
              </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="/assessment" className="text-gray-300 hover:text-white transition-colors">Start Assessment</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-5 w-5" />
                  <span>info@healthpredict.in</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-5 w-5" />
                  <span>Mysuru & Chamarajanagar, Karnataka</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Powered by</h3>
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-blue-400" />
                <span className="text-gray-300 text-lg">Doutly</span>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} HealthPredict. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
