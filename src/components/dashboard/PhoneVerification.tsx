import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Loader2, Shield, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentData } from '../../types/assessment';

interface PhoneVerificationProps {
  onVerified: (data: AssessmentData) => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format phone number (remove spaces, dashes, etc.)
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      console.log('Searching for phone number:', formattedPhone);
      
      // Query Firestore for matching phone number in both father and mother contact fields
      const fatherQuery = query(
        collection(db, 'assessments'),
        where('socioDemographic.fatherContact', '==', formattedPhone)
      );
      
      const motherQuery = query(
        collection(db, 'assessments'),
        where('socioDemographic.motherContact', '==', formattedPhone)
      );
      
      const [fatherSnapshot, motherSnapshot] = await Promise.all([
        getDocs(fatherQuery),
        getDocs(motherQuery)
      ]);
      
      console.log('Father query results:', fatherSnapshot.size);
      console.log('Mother query results:', motherSnapshot.size);
      
      if (fatherSnapshot.empty && motherSnapshot.empty) {
        setError("This number doesn't match our records. Please contact your school administrator.");
      } else {
        const assessmentDoc = !fatherSnapshot.empty 
          ? fatherSnapshot.docs[0] 
          : motherSnapshot.docs[0];
        
        const assessmentData = {
          id: assessmentDoc.id,
          ...assessmentDoc.data(),
          completedAt: assessmentDoc.data().completedAt?.toDate() || new Date()
        } as AssessmentData;
        
        console.log('Assessment data retrieved:', assessmentData);
        onVerified(assessmentData);
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secure Access Verification
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter your parent's phone number to access your personalized health insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="tel"
                  placeholder="Parent's phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-12 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                  required
                />
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Access My Dashboard'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Your data is protected with enterprise-grade security
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PhoneVerification;
