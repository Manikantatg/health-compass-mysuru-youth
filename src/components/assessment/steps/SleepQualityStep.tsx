
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SleepQuality } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SleepQualityStep: React.FC<Props> = ({ data, updateData }) => {
  const sleepQuality = data.sleepQuality as SleepQuality;

  const handleTimeChange = (field: 'bedtime' | 'wakeupTime', value: string) => {
    updateData('sleepQuality', { [field]: value });
  };

  const handleSleepIssueChange = (issue: string, checked: boolean) => {
    const currentIssues = sleepQuality.sleepIssues || [];
    const updatedIssues = checked
      ? [...currentIssues, issue]
      : currentIssues.filter(i => i !== issue);
    
    updateData('sleepQuality', { sleepIssues: updatedIssues });
  };

  const calculateSleepDuration = () => {
    if (sleepQuality.bedtime && sleepQuality.wakeupTime) {
      const bedtime = new Date(`2000-01-01T${sleepQuality.bedtime}`);
      const wakeup = new Date(`2000-01-02T${sleepQuality.wakeupTime}`);
      const diffInMs = wakeup.getTime() - bedtime.getTime();
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return '0h 0m';
  };

  const getSleepQualityMessage = () => {
    const duration = calculateSleepDuration();
    const hours = parseInt(duration.split('h')[0]);
    
    if (hours < 8) {
      return { message: 'You may need more sleep', color: 'text-red-600', bg: 'bg-red-50' };
    } else if (hours >= 8 && hours <= 10) {
      return { message: 'Great sleep duration!', color: 'text-green-600', bg: 'bg-green-50' };
    } else {
      return { message: 'You might be sleeping too much', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    }
  };

  const sleepIssueOptions = [
    'Difficulty falling asleep',
    'Waking up frequently during the night',
    'Waking up too early',
    'Feeling tired even after sleeping',
    'Nightmares or bad dreams',
    'Snoring',
    'Restless leg syndrome',
    'Sleep talking or sleepwalking',
    'Stress or anxiety affecting sleep',
    'Room too hot/cold',
    'Noise disturbances',
    'Uncomfortable bed or pillow'
  ];

  const qualityInfo = getSleepQualityMessage();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sleep Quality Assessment</h3>
        <p className="text-gray-600">Good sleep is essential for healthy growth and development</p>
      </div>

      {/* Sleep Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Schedule</CardTitle>
          <CardDescription>Tell us about your typical sleep and wake times</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={sleepQuality.bedtime}
                onChange={(e) => handleTimeChange('bedtime', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="wakeupTime">Wake-up Time</Label>
              <Input
                id="wakeupTime"
                type="time"
                value={sleepQuality.wakeupTime}
                onChange={(e) => handleTimeChange('wakeupTime', e.target.value)}
              />
            </div>
          </div>

          {/* Sleep Duration Display */}
          <div className={`p-4 rounded-lg ${qualityInfo.bg}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sleep Duration</p>
                <p className="text-2xl font-bold">{calculateSleepDuration()}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${qualityInfo.color}`}>
                  {qualityInfo.message}
                </p>
                <p className="text-sm text-gray-600">
                  Recommended: 8-10 hours for teens
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Issues</CardTitle>
          <CardDescription>Check any sleep problems you experience regularly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sleepIssueOptions.map((issue) => (
              <div key={issue} className="flex items-center space-x-2">
                <Checkbox
                  id={issue}
                  checked={sleepQuality.sleepIssues?.includes(issue) || false}
                  onCheckedChange={(checked) => handleSleepIssueChange(issue, checked as boolean)}
                />
                <Label htmlFor={issue} className="text-sm">
                  {issue}
                </Label>
              </div>
            ))}
          </div>

          {sleepQuality.sleepIssues && sleepQuality.sleepIssues.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">Sleep Issues Identified:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {sleepQuality.sleepIssues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
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

      {/* Sleep Quality Summary */}
      <Card className="bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Sleep Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Sleep Duration:</strong> {calculateSleepDuration()}</p>
            <p><strong>Bedtime:</strong> {sleepQuality.bedtime || 'Not set'}</p>
            <p><strong>Wake-up Time:</strong> {sleepQuality.wakeupTime || 'Not set'}</p>
            <p><strong>Sleep Issues:</strong> {sleepQuality.sleepIssues?.length || 0} identified</p>
            
            <div className="mt-4 p-3 bg-white border border-indigo-200 rounded-md">
              <p className="text-sm text-indigo-800">
                Quality sleep is crucial for physical growth, mental health, academic performance, and overall wellbeing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepQualityStep;
