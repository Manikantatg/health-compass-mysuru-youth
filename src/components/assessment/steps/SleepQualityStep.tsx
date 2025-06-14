import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    { value: "none", label: "Select frequency" },
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost Always' }
  ];

  const FrequencyDropdown = ({ field, label }: { field: keyof SleepQuality; label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <Select
        value={sleepQuality[field]?.toString() || "none"}
        onValueChange={(value) => handleChange(field, value === "none" ? undefined : parseInt(value))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          {frequencyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sleep Quality Assessment</h3>
        <p className="text-gray-600">Tell us about your sleep patterns and quality</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q1: Sleep Schedule</CardTitle>
          <CardDescription>Tell us about your typical sleep schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bedtime" className="text-sm font-medium">What time do you usually go to bed?</Label>
              <Input
                id="bedtime"
                type="time"
                value={sleepQuality.bedtime || ''}
                onChange={(e) => handleChange('bedtime', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wakeupTime" className="text-sm font-medium">What time do you usually wake up?</Label>
              <Input
                id="wakeupTime"
                type="time"
                value={sleepQuality.wakeupTime || ''}
                onChange={(e) => handleChange('wakeupTime', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Average Sleep Duration: <span className="text-lg">{calculateSleepDuration()}</span> hours
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q2: Sleep Quality</CardTitle>
          <CardDescription>How often do you experience these sleep-related issues?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencyDropdown field="difficultyFallingAsleep" label="I have difficulty falling asleep (I cannot get sleep within 30 minutes)" />
          <FrequencyDropdown field="wakeUpDuringSleep" label="I wake up while sleeping (bad dreams etc.,)" />
          <FrequencyDropdown field="wakeUpFromNoise" label="I wake up easily from the noise" />
          <FrequencyDropdown field="difficultyGettingBackToSleep" label="I have difficulty getting back to sleep once I wake up in the middle of the night" />
          <FrequencyDropdown field="sleepinessInClasses" label="Sleepiness interferes with my classes" />
          <FrequencyDropdown field="sleepHeadache" label="Poor sleep gives me a headache" />
          <FrequencyDropdown field="sleepIrritation" label="Poor sleep makes me irritated" />
          <FrequencyDropdown field="sleepLossOfInterest" label="Poor sleep makes me lose interest in work/studies" />
          <FrequencyDropdown field="sleepForgetfulness" label="Poor sleep makes me forget things more easily" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sleep Quality Summary</CardTitle>
          <CardDescription>Your sleep quality assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 text-sm">Sleep Duration</h4>
              <p className="text-xl font-bold text-blue-700 mt-1">{calculateSleepDuration()} hours</p>
              <p className="text-xs text-blue-600 mt-1">
                {calculateSleepDuration() >= 8 && calculateSleepDuration() <= 10 
                  ? "✅ Optimal" 
                  : calculateSleepDuration() >= 7 && calculateSleepDuration() <= 11 
                  ? "⚠️ Adequate" 
                  : "❌ Insufficient"}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 text-sm">Sleep Schedule</h4>
              <div className="text-xs text-indigo-700 mt-1">
                <div className="flex justify-between">
                  <span>Bedtime:</span>
                  <span className="font-medium">{sleepQuality.bedtime || 'Not set'}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Wake-up:</span>
                  <span className="font-medium">{sleepQuality.wakeupTime || 'Not set'}</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 text-sm">Sleep Issues</h4>
              <div className="text-xs text-green-700 mt-1">
                <div className="flex justify-between">
                  <span>Difficulty Falling Asleep:</span>
                  <span className="font-medium">
                    {sleepQuality.difficultyFallingAsleep > 2 ? '⚠️ High' : '✅ Low'}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Night Awakenings:</span>
                  <span className="font-medium">
                    {sleepQuality.wakeUpDuringSleep > 2 ? '⚠️ High' : '✅ Low'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 text-sm">Quick Tips</h4>
              <ul className="mt-2 space-y-1">
                {calculateSleepDuration() < 8 && (
                  <li className="text-xs text-purple-700 flex items-start">
                    <span className="mr-1">•</span>
                    Aim for 8-10 hours of sleep
                  </li>
                )}
                {sleepQuality.difficultyFallingAsleep > 2 && (
                  <li className="text-xs text-purple-700 flex items-start">
                    <span className="mr-1">•</span>
                    Avoid screens 1 hour before bed
                  </li>
                )}
                {sleepQuality.wakeUpDuringSleep > 2 && (
                  <li className="text-xs text-purple-700 flex items-start">
                    <span className="mr-1">•</span>
                    Keep bedroom cool and dark
                  </li>
                )}
                {sleepQuality.sleepinessInClasses > 2 && (
                  <li className="text-xs text-purple-700 flex items-start">
                    <span className="mr-1">•</span>
                    Maintain consistent sleep schedule
                  </li>
                )}
              </ul>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900 text-sm">Sleep Impact</h4>
              <ul className="mt-2 space-y-1">
                {sleepQuality.sleepHeadache > 2 && (
                  <li className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">•</span>
                    Headaches may indicate poor sleep
                  </li>
                )}
                {sleepQuality.sleepIrritation > 2 && (
                  <li className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">•</span>
                    Poor sleep affects mood
                  </li>
                )}
                {sleepQuality.sleepLossOfInterest > 2 && (
                  <li className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">•</span>
                    Sleep affects focus and interest
                  </li>
                )}
                {sleepQuality.sleepForgetfulness > 2 && (
                  <li className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">•</span>
                    Memory affected by sleep quality
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepQualityStep;
