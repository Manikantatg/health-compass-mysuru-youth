
import React from 'react';
import AssessmentForm from '../components/assessment/AssessmentForm';

const Assessment: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Health Assessment</h1>
        <p className="text-gray-600">
          Complete our comprehensive assessment to get personalized health insights and recommendations.
        </p>
      </div>
      <AssessmentForm />
    </div>
  );
};

export default Assessment;
