
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { AssessmentData } from '../../types/assessment';

interface ProfileSummaryCardProps {
  assessmentData: AssessmentData;
}

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ assessmentData }) => {
  const { socioDemographic, completedAt } = assessmentData;

  const getHealthSummary = () => {
    const bmi = assessmentData.bmi;
    if (bmi < 18.5) return "Focused on healthy weight gain";
    if (bmi < 25) return "Maintaining excellent health";
    if (bmi < 30) return "Working towards optimal wellness";
    return "Committed to health improvement";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-0">
          {/* Header Background */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="absolute -top-12 left-6"
            >
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="pt-16 space-y-4">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {socioDemographic.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-600 font-medium"
                >
                  {getHealthSummary()}
                </motion.p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Class {socioDemographic.class}-{socioDemographic.section}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Age {socioDemographic.age}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(completedAt).toLocaleDateString()}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 truncate">{socioDemographic.schoolName}</span>
                </motion.div>
              </div>

              {/* Health Metrics Quick View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex justify-between items-center pt-4 border-t border-gray-100"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{assessmentData.bmi.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">BMI</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{socioDemographic.height}</p>
                  <p className="text-xs text-gray-500">Height (cm)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{socioDemographic.weight}</p>
                  <p className="text-xs text-gray-500">Weight (kg)</p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSummaryCard;
