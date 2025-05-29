import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, School, Calendar, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    age: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        school: userProfile.school || '',
        age: userProfile.age?.toString() || '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (!currentUser) throw new Error('No user logged in');

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        school: formData.school,
        age: parseInt(formData.age),
        updatedAt: new Date().toISOString(),
      });

      await updateUserProfile({
        ...userProfile,
        ...formData,
        age: parseInt(formData.age),
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-gray-600">Update your personal information</p>
        </div>

        {/* Profile Form */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Personal Information</CardTitle>
            <CardDescription>Update your profile details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* School Field */}
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-gray-700">School</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="school"
                      name="school"
                      type="text"
                      value={formData.school}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Age Field */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      min="6"
                      max="17"
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                  >
                    <p className="text-green-700 font-medium">Profile updated successfully!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
