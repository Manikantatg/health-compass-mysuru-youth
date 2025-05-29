import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneVerificationProps {
  onVerified: (data: any) => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format phone number (remove spaces, dashes, etc.)
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      // Query Firestore for matching phone number
      const q = query(
        collection(db, 'assessments'),
        where('socioDemographic.phone', '==', formattedPhone)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('No assessment found with this phone number. Please check and try again.');
      } else {
        const assessmentData = querySnapshot.docs[0].data();
        onVerified(assessmentData);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error fetching assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-900">
          Welcome to Your Health Dashboard
        </CardTitle>
        <CardDescription className="text-blue-700">
          Enter your phone number to view your personalized health insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10 py-6 text-lg"
              required
            />
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-600 text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              'View My Health Report'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
