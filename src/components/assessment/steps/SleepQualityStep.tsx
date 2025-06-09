import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  const calculateSleepDuration = () => {
    if (sleepQuality.bedtime && sleepQuality.wakeupTime) {
      const bedtime = new Date(`2000-01-01 ${sleepQuality.bedtime}`);
      let wakeup = new Date(`2000-01-01 ${sleepQuality.wakeupTime}`);
      
      // If wakeup time is earlier than bedtime, it means next day
      if (wakeup < bedtime) {
        wakeup = new Date(`2000-01-02 ${sleepQuality.wakeupTime}`);
      }
      
      const durationMs = wakeup.getTime() - bedtime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      return Math.round(durationHours * 10) / 10; // Round to 1 decimal place
    }
    return 0;
  };

  const frequencyOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost Always' }
  ];

  const FrequencyRadio = ({ field, label }: { field: keyof SleepQuality; label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={sleepQuality[field]?.toString() || "0"}
        onValueChange={(value) => handleChange(field, parseInt(value))}
        className="flex flex-wrap gap-4"
      >
        {frequencyOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value.toString()} id={`${field}-${option.value}`} />
            <Label htmlFor={`${field}-${option.value}`} className="text-sm cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sleep Quality Assessment (Last 30 Days)</h3>
        <p className="text-gray-600">Please rate how often you experience these sleep-related situations</p>
      </div>

      {/* Sleep Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Schedule</CardTitle>
          <CardDescription>What time do you usually go to bed and wake up?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedtime">Sleep Start Time</Label>
              <Input
                id="bedtime"
                type="time"
                value={sleepQuality.bedtime || '22:00'}
                onChange={(e) => handleChange('bedtime', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeupTime">Wake-up Time</Label>
              <Input
                id="wakeupTime"
                type="time"
                value={sleepQuality.wakeupTime || '06:00'}
                onChange={(e) => handleChange('wakeupTime', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Sleep Duration Display */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Sleep Duration (auto-computed):</span>
              <span className="text-lg font-bold text-blue-700">
                {calculateSleepDuration()} hours
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Recommended: 8-10 hours for teenagers, 9-11 hours for children
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Quality Issues</CardTitle>
          <CardDescription>Rate how often you experience these sleep problems (Last 30 Days)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencyRadio 
            field="difficultyFallingAsleep" 
            label="I have difficulty falling asleep (can't sleep within 30 minutes)" 
          />
          <FrequencyRadio 
            field="wakeUpDuringSleep" 
            label="I wake up while sleeping (e.g., due to bad dreams)" 
          />
          <FrequencyRadio 
            field="wakeUpFromNoise" 
            label="I wake up easily from noise" 
          />
          <FrequencyRadio 
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
          <FrequencyRadio 
            field="sleepinessInClasses" 
            label="Sleepiness interferes with my classes" 
          />
          <FrequencyRadio 
            field="sleepHeadache" 
            label="Poor sleep gives me a headache" 
          />
          <FrequencyRadio 
            field="sleepIrritation" 
            label="Poor sleep makes me irritated" 
          />
          <FrequencyRadio 
            field="sleepLossOfInterest" 
            label="Poor sleep makes me lose interest in work/studies" 
          />
          <FrequencyRadio 
            field="sleepForgetfulness" 
            label="Poor sleep makes me forget things more easily" 
          />
        </CardContent>
      </Card>

      {/* Sleep Assessment Summary */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Sleep Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Sleep Schedule</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Bedtime:</strong> {sleepQuality.bedtime || '22:00'}</p>
                <p><strong>Wake-up Time:</strong> {sleepQuality.wakeupTime || '06:00'}</p>
                <p><strong>Sleep Duration:</strong> {calculateSleepDuration()} hours</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sleep Quality Issues</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Difficulty Falling Asleep:</strong> {frequencyOptions[sleepQuality.difficultyFallingAsleep]?.label}</p>
                <p><strong>Wake Up During Sleep:</strong> {frequencyOptions[sleepQuality.wakeUpDuringSleep]?.label}</p>
                <p><strong>Daytime Sleepiness:</strong> {frequencyOptions[sleepQuality.sleepinessInClasses]?.label}</p>
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
      <Card className="bg-blue-50 border-blue-200">
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
