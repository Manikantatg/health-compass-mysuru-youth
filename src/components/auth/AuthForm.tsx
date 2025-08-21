import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Heart, Shield, Brain, Users, Activity, CheckCircle, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    login,
    signup
  } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    schoolName: '',
    role: 'student'
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });
      } else {
        await signup(formData.email, formData.password, {
          name: formData.name,
          age: parseInt(formData.age),
          schoolName: formData.schoolName,
          role: formData.role
        });
        toast({
          title: "Account created!",
          description: "Welcome to PediaPredict."
        });
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const features = [{
    icon: Zap,
    text: "5-minute health assessment",
    color: "text-primary"
  }, {
    icon: Brain,
    text: "AI-powered insights",
    color: "text-info"
  }, {
    icon: Shield,
    text: "100% secure & private",
    color: "text-success"
  }, {
    icon: Users,
    text: "Built for schools",
    color: "text-warning"
  }, {
    icon: Activity,
    text: "Comprehensive health tracking",
    color: "text-primary"
  }, {
    icon: Target,
    text: "Personalized recommendations",
    color: "text-info"
  }];
  return <div className="min-h-screen flex flex-col md:flex-row bg-background font-inter">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <Card className="border-0 shadow-xl rounded-3xl bg-card">
              <CardHeader className="space-y-2 text-center pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <img src="/lovable-uploads/logo.jpg" alt="PediaPredict Logo" className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Join PediaPredict'}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  {isLogin ? 'Sign in to access your health dashboard' : 'Create your account to start your health journey'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                        <Input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="h-12 rounded-xl border-border focus:border-primary transition-colors" required />
                      </div>
                      
                      

                      <div className="space-y-2">
                        <Label htmlFor="schoolName" className="text-sm font-medium text-foreground">School Name</Label>
                        <Input id="schoolName" type="text" placeholder="Enter your school name" value={formData.schoolName} onChange={e => handleInputChange('schoolName', e.target.value)} className="h-12 rounded-xl border-border focus:border-primary transition-colors" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-foreground">Role</Label>
                        <Select value={formData.role} onValueChange={value => handleInputChange('role', value)}>
                          <SelectTrigger className="h-12 rounded-xl border-border focus:border-primary">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="h-12 rounded-xl border-border focus:border-primary transition-colors" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="h-12 rounded-xl border-border focus:border-primary transition-colors" required />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" disabled={loading}>
                    {loading ? <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div> : isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:text-primary/80 underline font-medium transition-colors">
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <div className="flex flex-col items-center justify-center mt-6 space-y-4">
            <div className="flex flex-row items-center justify-center space-x-8">
              <img src="https://jssaherstoragenew.blob.core.windows.net/jssuudstorage/sdimages/jssnewlogo.jpg" alt="JSS Academy of Higher Education & Research Logo" className="h-16 w-auto object-contain" />
              <img src="https://www.jssstuniv.in/assets/img/logo/jssstulogo.png" alt="JSS Science and Technology University Logo" className="h-16 w-auto object-contain" />
            </div>
            
            <p className="text-sm font-medium text-[#7C3AED] text-center">Provided by Doutly and SugarSaltMedia</p>
            
            {/* Legal Footer Links */}
            <div className="mt-8 pt-6 border-t border-border/30 w-full max-w-md">
              <div className="text-center space-y-3">
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/legal/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/legal/medical-disclaimer" className="text-muted-foreground hover:text-primary">Medical Disclaimer</Link>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <Link to="/legal/cookies" className="text-muted-foreground hover:text-primary">Cookie Policy</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/legal/data-deletion" className="text-muted-foreground hover:text-primary">Data Deletion</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/legal/contact" className="text-muted-foreground hover:text-primary">Contact & Support</Link>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  © 2024 PediaPredict by Doutly. Educational use only. Not medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary/5 via-secondary/10 to-info/5 items-center justify-center p-8 relative overflow-hidden">
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="max-w-xs lg:max-w-sm text-center relative z-10">
          {/* Main Illustration */}
          <div className="mb-8">
            <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-border/30">
              <div className="w-36 h-36 lg:w-48 lg:h-48 bg-card/50 rounded-full flex items-center justify-center backdrop-blur-xl border border-border/50">
                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-success/20 rounded-2xl flex items-center justify-center">
                    <Activity className="h-6 w-6 lg:h-8 lg:w-8 text-success" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-info/20 rounded-2xl flex items-center justify-center">
                    <Brain className="h-6 w-6 lg:h-8 lg:w-8 text-info" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-warning/20 rounded-2xl flex items-center justify-center">
                    <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-warning" />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }} className="absolute inset-0">
                {[0, 60, 120, 180, 240, 300].map((rotation, index) => <div key={index} className="absolute w-6 h-6 lg:w-8 lg:h-8 bg-primary/10 rounded-full" style={{
                top: `calc(50% - ${index * 2}px)`,
                left: `calc(50% - ${index * 2}px)`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) translate(90px) rotate(-${rotation}deg)`
              }} />)}
              </motion.div>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Health Journey Starts Here
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Gain personalized insights and track your progress with ease.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.3 + index * 0.1
          }} className="flex items-center justify-center gap-3 text-lg text-foreground">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <span>{feature.text}</span>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </div>;
};
export default AuthForm;