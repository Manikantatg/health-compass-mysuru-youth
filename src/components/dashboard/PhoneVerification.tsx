
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Lock, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhoneVerificationProps {
  onVerified: () => void;
  isVerified: boolean;
  fatherContact?: string;
  motherContact?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  onVerified, 
  isVerified, 
  fatherContact = '',
  motherContact = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number to unlock detailed insights",
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

    // Check if entered number matches father's or mother's contact
    const normalizedInput = phoneNumber.replace(/\D/g, '').slice(-10);
    const normalizedFather = fatherContact.replace(/\D/g, '').slice(-10);
    const normalizedMother = motherContact.replace(/\D/g, '').slice(-10);

    if (normalizedInput !== normalizedFather && normalizedInput !== normalizedMother) {
      toast({
        title: "Verification failed",
        description: "Phone number doesn't match parent contact information",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
      toast({
        title: "Verification successful!",
        description: "You now have access to detailed pros and cons analysis",
      });
    }, 2000);
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
        <div className="flex items-center space-x-3 text-green-700">
          <div className="p-2 bg-green-200 rounded-full">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Phone Verified ✓</p>
            <p className="text-sm opacity-75">Access to detailed insights unlocked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto p-4 bg-blue-100 rounded-full w-fit">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold text-blue-900">
          🔒 Unlock Detailed Analysis
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter your parent's phone number to access detailed pros & cons analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
            <Input
              type="tel"
              placeholder="Enter parent's phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="pl-12 text-lg font-medium border-2 border-blue-200 focus:border-blue-400 rounded-xl"
              disabled={isVerifying}
            />
          </div>
          
          <Button
            onClick={handleVerification}
            disabled={isVerifying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <span>🔓 Unlock Analysis</span>
            )}
          </Button>
        </div>

        <div className="text-center p-4 bg-blue-100/50 rounded-xl">
          <p className="text-sm text-blue-700">
            🔐 Enter the phone number from your assessment (Father's or Mother's contact)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
