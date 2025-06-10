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
        value={sleepQuality[field]?.toString() || "0"}
        onValueChange={(value) => handleChange(field, parseInt(value))}
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
          <FrequencyDropdown field="difficultyFallingAsleep" label="Have difficulty falling asleep" />
          <FrequencyDropdown field="difficultyStayingAsleep" label="Have difficulty staying asleep" />
          <FrequencyDropdown field="wakeUpEarly" label="Wake up too early and cannot fall back asleep" />
          <FrequencyDropdown field="feelTired" label="Feel tired or sleepy during the day" />
          <FrequencyDropdown field="snore" label="Snore loudly" />
          <FrequencyDropdown field="stopBreathing" label="Stop breathing or gasp for air during sleep" />
          <FrequencyDropdown field="legsCramp" label="Have legs that cramp or jerk during sleep" />
          <FrequencyDropdown field="feelDisoriented" label="Feel disoriented or confused when waking up" />
          <FrequencyDropdown field="useSleepingPills" label="Take sleeping pills or other medication to help sleep" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q3: Sleep Environment</CardTitle>
          <CardDescription>Tell us about your sleep environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Do you sleep in a quiet environment?</Label>
            <Select
              value={sleepQuality.quietEnvironment || "yes"}
              onValueChange={(value) => handleChange('quietEnvironment', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Do you sleep in a dark environment?</Label>
            <Select
              value={sleepQuality.darkEnvironment || "yes"}
              onValueChange={(value) => handleChange('darkEnvironment', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Do you use electronic devices before bed?</Label>
            <Select
              value={sleepQuality.useElectronics || "yes"}
              onValueChange={(value) => handleChange('useElectronics', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepQualityStep;
