
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Lock, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhoneVerificationProps {
  onVerified: () => void;
  isVerified: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified, isVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleVerification = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to unlock detailed insights",
        variant: "destructive"
      });
      return;
    }

    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setShowAnimation(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
      toast({
        title: "Verification successful! 🎉",
        description: "You now have access to detailed pros and cons analysis",
      });
    }, 2000);
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 animate-pulse">
        <div className="flex items-center space-x-3 text-green-700">
          <div className="p-2 bg-green-200 rounded-full animate-bounce">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Phone Verified ✅</p>
            <p className="text-sm opacity-75">Access to detailed insights unlocked!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto p-4 bg-orange-100 rounded-full w-fit animate-pulse">
          <Lock className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          🔒 Unlock Detailed Insights
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter your phone number to access detailed pros & cons analysis of your health assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="pl-12 text-lg font-medium border-2 border-orange-200 focus:border-orange-400 rounded-xl"
              disabled={isVerifying}
            />
          </div>
          
          <Button
            onClick={handleVerification}
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <span>🚀 Unlock Insights</span>
            )}
          </Button>
        </div>

        {showAnimation && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-orange-600 animate-bounce">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        <div className="text-center p-4 bg-orange-100/50 rounded-xl">
          <p className="text-sm text-orange-700">
            🔐 Your phone number is used only for verification and kept secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
