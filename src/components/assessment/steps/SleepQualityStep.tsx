
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SleepQuality } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SleepQualityStep: React.FC<Props> = ({ data, updateData }) => {
  const sleepQuality = data.sleepQuality as SleepQuality;

  const handleChange = (field: keyof SleepQuality, value: any) => {
    updateData('sleepQuality', { [field]: value });
  };

  const frequencyLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost Always'];

  const FrequencySlider = ({ field, label }: { field: keyof SleepQuality; label: string }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {frequencyLabels[sleepQuality[field] as number]}
        </span>
      </div>
      <Slider
        value={[sleepQuality[field] as number]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={4}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Never</span>
        <span>Almost Always</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sleep Quality Assessment (Last 30 Days)</h3>
        <p className="text-gray-600">Please rate how often you experience these sleep-related situations</p>
      </div>

      {/* Sleep Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Quality Issues</CardTitle>
          <CardDescription>Rate how often you experience these sleep problems (Last 30 Days)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencySlider 
            field="difficultyFallingAsleep" 
            label="I have difficulty falling asleep (can't sleep within 30 minutes)" 
          />
          <FrequencySlider 
            field="wakeUpDuringSleep" 
            label="I wake up while sleeping (e.g., due to bad dreams)" 
          />
          <FrequencySlider 
            field="wakeUpFromNoise" 
            label="I wake up easily from noise" 
          />
          <FrequencySlider 
            field="difficultyGettingBackToSleep" 
            label="I have difficulty getting back to sleep once awake" 
          />
        </CardContent>
      </Card>

      {/* Sleep Impact on Daily Life */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Impact on Daily Life</CardTitle>
          <CardDescription>How does poor sleep affect your daily activities? (Last 30 Days)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencySlider 
            field="sleepinessInClasses" 
            label="Sleepiness interferes with my classes" 
          />
          <FrequencySlider 
            field="sleepHeadache" 
            label="Poor sleep gives me a headache" 
          />
          <FrequencySlider 
            field="sleepIrritation" 
            label="Poor sleep makes me irritated" 
          />
          <FrequencySlider 
            field="sleepLossOfInterest" 
            label="Poor sleep makes me lose interest in work/studies" 
          />
          <FrequencySlider 
            field="sleepForgetfulness" 
            label="Poor sleep makes me forget things more easily" 
          />
        </CardContent>
      </Card>

      {/* Sleep Assessment Summary */}
      <Card className="bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Sleep Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Sleep Issues Score</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Difficulty Falling Asleep:</strong> {frequencyLabels[sleepQuality.difficultyFallingAsleep]}</p>
                <p><strong>Wake Up During Sleep:</strong> {frequencyLabels[sleepQuality.wakeUpDuringSleep]}</p>
                <p><strong>Wake Up From Noise:</strong> {frequencyLabels[sleepQuality.wakeUpFromNoise]}</p>
                <p><strong>Difficulty Getting Back to Sleep:</strong> {frequencyLabels[sleepQuality.difficultyGettingBackToSleep]}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Daily Impact Score</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Sleepiness in Classes:</strong> {frequencyLabels[sleepQuality.sleepinessInClasses]}</p>
                <p><strong>Sleep-Related Headaches:</strong> {frequencyLabels[sleepQuality.sleepHeadache]}</p>
                <p><strong>Sleep-Related Irritation:</strong> {frequencyLabels[sleepQuality.sleepIrritation]}</p>
                <p><strong>Loss of Interest:</strong> {frequencyLabels[sleepQuality.sleepLossOfInterest]}</p>
                <p><strong>Forgetfulness:</strong> {frequencyLabels[sleepQuality.sleepForgetfulness]}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white border border-indigo-200 rounded-md">
            <p className="text-sm text-indigo-800">
              Quality sleep is crucial for physical growth, mental health, academic performance, and overall wellbeing. 
              If you're experiencing frequent sleep issues, consider talking to a healthcare professional.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Hygiene Tips */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Sleep Hygiene Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Good Sleep Habits:</h4>
              <ul className="text-sm space-y-1">
                <li>• Keep a consistent sleep schedule</li>
                <li>• Create a relaxing bedtime routine</li>
                <li>• Keep your bedroom cool and dark</li>
                <li>• Avoid screens 1 hour before bed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Things to Avoid:</h4>
              <ul className="text-sm space-y-1">
                <li>• Caffeine late in the day</li>
                <li>• Large meals before bedtime</li>
                <li>• Stimulating activities before sleep</li>
                <li>• Using devices in bed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepQualityStep;
