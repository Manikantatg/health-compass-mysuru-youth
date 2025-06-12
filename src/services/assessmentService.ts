import { AssessmentData, AIPrediction } from '@/types/assessment';
import { generateObesityPrediction } from '@/utils/generateObesityPrediction';

export const submitAssessment = async (assessmentData: AssessmentData): Promise<AssessmentData> => {
  try {
    // Generate AI prediction
    const aiPrediction = await generateObesityPrediction(assessmentData);
    
    // Add AI prediction to assessment data
    const enrichedAssessmentData = {
      ...assessmentData,
      aiPrediction,
      completedAt: new Date()
    };

    // Save to database
    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedAssessmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return enrichedAssessmentData;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
}; 