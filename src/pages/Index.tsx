
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Heart, Shield, TrendingUp, Users, CheckCircle, BarChart, Clock, Award, Target, Zap, Mail, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    { icon: Zap, text: "5-min assessment", color: "text-primary" },
    { icon: Shield, text: "100% private data", color: "text-success" },
    { icon: Brain, text: "AI trained for local youth", color: "text-primary" },
    { icon: Users, text: "Built for ages 6–17", color: "text-info" },
    { icon: MapPin, text: "Made for Karnataka", color: "text-primary" },
    { icon: CheckCircle, text: "Backed by doctors", color: "text-success" }
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Smart predictions using advanced machine learning algorithms',
      color: 'bg-primary'
    },
    {
      icon: Activity,
      title: 'Complete Health Profiling',
      description: 'Comprehensive assessment covering physical, mental, and lifestyle health',
      color: 'bg-info'
    },
    {
      icon: TrendingUp,
      title: 'Personalized Insights',
      description: 'Custom recommendations based on your individual health profile',
      color: 'bg-success'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is secure, encrypted, and never shared without consent',
      color: 'bg-primary'
    },
    {
      icon: MapPin,
      title: 'Built for Local Youth',
      description: 'Specifically designed and validated for Karnataka student population',
      color: 'bg-info'
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Sign Up', description: 'Quick & easy registration process' },
    { step: '02', title: 'Complete Assessment', description: 'Answer questions in just 5 minutes' },
    { step: '03', title: 'Get Health Score', description: 'Receive instant AI-powered analysis' },
    { step: '04', title: 'Follow Recommendations', description: 'Get personalized health improvement tips' }
  ];

  const whyItMatters = [
    {
      icon: Heart,
      title: 'Early Detection',
      description: 'Identify health risks before they become serious problems',
      stat: '85% of health issues are preventable with early intervention'
    },
    {
      icon: TrendingUp,
      title: 'Better Outcomes',
      description: 'Students with regular health monitoring show improved academic performance',
      stat: '40% improvement in focus and energy levels'
    },
    {
      icon: Users,
      title: 'Community Health',
      description: 'School-wide health insights help create healthier environments',
      stat: '60% reduction in sick days across participating schools'
    }
  ];

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Hero Section - Fixed overlay issues */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 min-h-screen flex items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-20 relative"
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
                <span className="px-6 py-3 bg-primary/10 rounded-full text-sm font-medium text-primary border border-primary/20 flex items-center gap-2 w-fit">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  AI-Powered Health Assessment
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-8 text-foreground leading-tight tracking-tight"
              >
                Scan Your{' '}
                <span className="text-primary">Health</span>{' '}
                in 5 Mins
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
              >
                AI-powered health insights designed specifically for school students in Karnataka. 
                <span className="text-primary font-medium"> Fast, private, and empowering.</span>
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-lg font-semibold shadow-lg transition-all duration-300 rounded-xl group"
                >
                  <span className="flex items-center gap-3">
                    Start Assessment Now
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
                  className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-12 py-6 text-lg font-semibold rounded-xl transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    For Schools & Clinics
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
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10"></div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">1000+</span> students trust us in Karnataka
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[600px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl backdrop-blur-sm"></div>
              <div className="absolute inset-4 bg-card/50 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold text-xl">AI Health Analysis</h3>
                        <p className="text-muted-foreground text-sm">Real-time insights</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Physical Health', score: 92 },
                        { label: 'Mental Wellness', score: 87 },
                        { label: 'Sleep Quality', score: 94 }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                          <span className="text-foreground font-medium">{item.label}: {item.score}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ delay: 1 + i * 0.2, duration: 1 }}
                              className="h-full bg-primary rounded-full"
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
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">100% Private</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-6 bg-card p-4 rounded-2xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-warning rounded-xl flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">5-min Assessment</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Key Features Section */}
      <div className="py-24 bg-surface">
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
                  <div className="h-full p-6 bg-card rounded-2xl hover:shadow-md transition-all duration-300 border border-border hover:border-primary/30">
                    <div className={`w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <p className="text-base text-foreground font-medium">{feature.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Why It Matters Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
              Why It <span className="text-primary">Matters</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Early health insights can transform student wellbeing and academic success
            </p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {whyItMatters.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 rounded-2xl bg-card">
                    <CardHeader className="pb-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 ${item.icon === Heart ? 'bg-destructive/10' : item.icon === TrendingUp ? 'bg-success/10' : 'bg-primary/10'} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${item.icon === Heart ? 'text-destructive' : item.icon === TrendingUp ? 'text-success' : 'text-primary'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground tracking-tight">
                            {item.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed text-base mb-4">
                        {item.description}
                      </CardDescription>
                      <div className="px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-sm font-semibold text-primary">{item.stat}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-foreground mb-20 tracking-tight"
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
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
              Built for <span className="text-primary">Schools & Clinics</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade health assessment tools designed for educational and medical environments
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 rounded-2xl bg-card">
                    <CardHeader className="pb-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 ${benefit.color}/10 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${benefit.color === 'bg-primary' ? 'text-primary' : benefit.color === 'bg-success' ? 'text-success' : 'text-info'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground tracking-tight">
                            {benefit.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed text-base">
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
                
      {/* Final CTA Section */}
      <div className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold text-foreground mb-12 tracking-tight">
              Ready to Scan Your{' '}
              <span className="text-primary">Health</span>?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-lg font-semibold shadow-lg transition-all duration-300 rounded-xl group"
              >
                <span className="flex items-center gap-3">
                  Start Assessment Now
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
                className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-12 py-6 text-lg font-semibold rounded-xl transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  For Schools & Clinics
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="/" className="text-muted hover:text-background transition-colors">Home</a></li>
                <li><a href="/about" className="text-muted hover:text-background transition-colors">About</a></li>
                <li><a href="/assessment" className="text-muted hover:text-background transition-colors">Start Assessment</a></li>
                <li><a href="/contact" className="text-muted hover:text-background transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-muted">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>info@healthpredict.in</span>
                </li>
                <li className="flex items-center space-x-3 text-muted">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Mysuru & Chamarajanagar, Karnataka</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="/privacy" className="text-muted hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-muted hover:text-background transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Powered by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-muted text-lg">Doutly</span>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-muted text-center">
            <p className="text-muted">
              © {new Date().getFullYear()} HealthPredict. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
