
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Heart, Shield, TrendingUp, Users, CheckCircle, BarChart, Clock, Award, Target, Zap, Mail, MapPin, ArrowRight, ChevronRight, RefreshCw, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

const Index: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const keyFeatures = [
    { icon: Zap, text: "5-min assessment", gradient: "from-electric-blue to-neon-cyan" },
    { icon: Shield, text: "100% private data", gradient: "from-mint-green to-neon-cyan" },
    { icon: Brain, text: "AI trained for local youth", gradient: "from-neon-purple to-neon-pink" },
    { icon: Users, text: "Built for ages 6–17", gradient: "from-sunset-orange to-neon-pink" },
    { icon: MapPin, text: "Made for Karnataka", gradient: "from-electric-blue to-mint-green" },
    { icon: CheckCircle, text: "Backed by doctors", gradient: "from-neon-pink to-neon-purple" }
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Smart predictions using advanced machine learning',
      gradient: 'from-neon-purple to-electric-blue'
    },
    {
      icon: Activity,
      title: 'Complete Health Profiling',
      description: 'Covers physical, mental, and lifestyle health',
      gradient: 'from-electric-blue to-neon-cyan'
    },
    {
      icon: TrendingUp,
      title: 'Personalized Insights',
      description: 'Custom tips based on your responses',
      gradient: 'from-sunset-orange to-neon-pink'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data = your control. Never shared.',
      gradient: 'from-mint-green to-electric-blue'
    },
    {
      icon: MapPin,
      title: 'Built for Local Youth',
      description: 'Designed for Karnataka youth',
      gradient: 'from-neon-pink to-neon-purple'
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Sign Up', description: 'Quick & easy registration' },
    { step: '02', title: 'Answer Qs', description: 'Just 5 minutes' },
    { step: '03', title: 'Get Score', description: 'Instant risk assessment' },
    { step: '04', title: 'Smart Tips', description: 'Personalized recommendations' }
  ];

  const testimonials = [
    {
      quote: "This assessment helped me understand my health better and motivated me to make positive changes.",
      author: "Sarah M.",
      location: "Student, Grade 10",
      icon: Heart
    },
    {
      quote: "The personalized recommendations were exactly what I needed to improve my lifestyle.",
      author: "Alex K.", 
      location: "Student, Grade 12",
      icon: Star
    },
    {
      quote: "Simple, quick, and very insightful. I love how it gives me clear action steps.",
      author: "Maya P.",
      location: "Student, Grade 9", 
      icon: Target
    }
  ];

  const faqs = [
    {
      question: "How accurate is the health assessment?",
      answer: "Our assessment uses scientifically validated methods and AI analysis to provide reliable health insights based on your responses.",
      icon: Brain
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use enterprise-grade security measures to protect your data. Your information is encrypted and never shared without consent.",
      icon: Shield
    },
    {
      question: "How long does the assessment take?",
      answer: "The complete assessment takes about 10-15 minutes. You can save your progress and continue later if needed.",
      icon: Clock
    },
    {
      question: "Can I retake the assessment?",
      answer: "Yes, you can retake the assessment anytime to track your progress and get updated recommendations.",
      icon: RefreshCw
    }
  ];

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-off-white font-inter">
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-dark min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-20 relative z-10"
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
                <span className="px-6 py-3 glass-morphism rounded-full text-sm font-medium text-white border border-white/20 flex items-center gap-2 group hover:bg-white/20 transition-all duration-300 font-satoshi">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                  AI-Powered Health Assessment
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-satoshi font-bold mb-8 text-white leading-none tracking-tighter"
              >
                Scan Your{' '}
                <span className="text-gradient-electric">Health</span>{' '}
                in 5 Mins
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-inter"
              >
                AI-powered insights for school kids in Mysuru & Chamarajanagar. 
                <span className="text-neon-cyan font-medium"> Fast, private, and empowering.</span>
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
                  className="gradient-electric text-white hover:opacity-90 px-12 py-8 text-lg font-semibold shadow-2xl transition-all duration-300 rounded-2xl group button-modern button-press font-satoshi tracking-tight"
                >
                  <span className="flex items-center gap-3 relative z-10">
                    Start Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-jet-black px-12 py-8 text-lg font-semibold rounded-2xl transition-all duration-300 group button-press font-satoshi tracking-tight backdrop-blur-sm"
                >
                  <span className="flex items-center gap-3">
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
                className="mt-16 flex items-center gap-8"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white glass-morphism animate-float" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 font-inter">
                  <span className="text-neon-cyan font-semibold">1000+</span> students trust us in Karnataka
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[700px]"
            >
              <div className="absolute inset-0 gradient-electric rounded-4xl backdrop-blur-sm opacity-20 animate-pulse-glow"></div>
              <div className="absolute inset-4 glass-morphism rounded-4xl backdrop-blur-xl border border-white/20">
                <div className="p-8 h-full flex flex-col justify-center">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 gradient-electric rounded-2xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-satoshi font-semibold text-xl">AI Health Analysis</h3>
                        <p className="text-gray-400 text-sm">Real-time insights</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {['Physical Health: 92%', 'Mental Wellness: 87%', 'Sleep Quality: 94%'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass-morphism rounded-xl">
                          <span className="text-white font-inter">{item}</span>
                          <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${85 + i * 5}%` }}
                              transition={{ delay: 1 + i * 0.2, duration: 1 }}
                              className="h-full gradient-electric rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 glass-morphism p-4 rounded-2xl shadow-2xl border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-electric rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white font-satoshi">100% Private</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-6 glass-morphism p-4 rounded-2xl shadow-2xl border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-sunset rounded-xl flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white font-satoshi">5-min Assessment</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Key Features Section */}
      <div className="space-section bg-off-white">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto"
          >
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="h-full p-6 bg-white rounded-3xl hover-lift transition-all duration-300 border border-gray-100 hover:border-electric-blue/30 card-interactive">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-base text-gray-700 font-medium font-inter">{feature.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-section gradient-lavender">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-center text-jet-black mb-20 font-satoshi tracking-tighter"
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
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-electric-blue to-transparent"></div>
                )}
                <div className="w-20 h-20 gradient-electric text-white rounded-3xl flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300 relative font-satoshi">
                  {item.step}
                  <div className="absolute inset-0 gradient-electric rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-jet-black font-satoshi tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-inter">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-section bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold text-jet-black mb-6 font-satoshi tracking-tighter">
              Why It&apos;s <span className="text-gradient-sunset">Powerful</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">
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
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full hover-lift transition-all duration-300 border-0 rounded-3xl bg-white shadow-lg hover:shadow-2xl card-interactive">
                    <CardHeader className="pb-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 bg-gradient-to-br ${benefit.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-jet-black font-satoshi tracking-tight">
                            {benefit.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed text-base font-inter">
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
      <div className="space-section gradient-lavender">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-center text-jet-black mb-20 font-satoshi tracking-tighter"
          >
            What People Say
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto"
          >
            {testimonials.map((testimonial, index) => {
              const Icon = testimonial.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white card-interactive">
                    <CardContent className="p-10">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 gradient-sunset rounded-2xl flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-jet-black font-satoshi">{testimonial.author}</p>
                            <p className="text-gray-500 font-inter text-sm">{testimonial.location}</p>
                          </div>
                        </div>
                        <p className="text-xl text-gray-700 mb-8 flex-grow leading-relaxed font-inter">&quot;{testimonial.quote}&quot;</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-section bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-center text-jet-black mb-20 font-satoshi tracking-tighter"
          >
            Got Questions?
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-3xl bg-white card-interactive">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 gradient-electric rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-jet-black mb-4 font-satoshi tracking-tight">{faq.question}</h3>
                          <p className="text-gray-600 leading-relaxed font-inter">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
                
      {/* Final CTA Section */}
      <div className="space-section gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-6xl font-bold text-white mb-12 font-satoshi tracking-tighter">
              Ready to Scan Your{' '}
              <span className="text-gradient-electric">Health</span>?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="gradient-electric text-white hover:opacity-90 px-12 py-8 text-lg font-semibold shadow-2xl transition-all duration-300 rounded-2xl group button-modern button-press font-satoshi tracking-tight"
              >
                <span className="flex items-center gap-3 relative z-10">
                  Start Now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact')}
                className="border-2 border-white/30 text-white hover:bg-white hover:text-jet-black px-12 py-8 text-lg font-semibold rounded-2xl transition-all duration-300 group button-press font-satoshi tracking-tight backdrop-blur-sm"
              >
                <span className="flex items-center gap-3">
                  For Schools & Doctors
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-jet-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-6 font-satoshi">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="/" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">About</a></li>
                <li><a href="/assessment" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">Start Assessment</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 font-satoshi">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5 text-neon-cyan" />
                  <span className="font-inter">info@healthpredict.in</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-neon-cyan" />
                  <span className="font-inter">Mysuru & Chamarajanagar, Karnataka</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 font-satoshi">Legal</h3>
              <ul className="space-y-4">
                <li><a href="/privacy" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-neon-cyan transition-colors nav-link font-inter">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 font-satoshi">Powered by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-electric rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-400 text-lg font-satoshi">Doutly</span>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 font-inter">
              © {new Date().getFullYear()} HealthPredict. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
