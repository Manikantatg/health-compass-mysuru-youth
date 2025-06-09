
import React from 'react';
import AssessmentForm from '../components/assessment/AssessmentForm';

const Assessment: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Obesity Risk Assessment</h1>
        <p className="text-gray-600">
          Complete our comprehensive assessment to get personalized obesity risk insights and recommendations from PediaPredict AI.
        </p>
      </div>
      <AssessmentForm />
    </div>
  );
};

export default Assessment;
