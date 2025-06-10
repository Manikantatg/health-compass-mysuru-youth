import React from 'react';
import AssessmentForm from '../components/assessment/AssessmentForm';

const Assessment: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Obesity Risk Assessment</h1>
        <p className="text-sm md:text-base text-gray-600">
          Complete our comprehensive assessment to get personalized obesity risk insights and recommendations from PediaPredict AI.
        </p>
      </div>
      <AssessmentForm />
    </div>
  );
};

export default Assessment;
