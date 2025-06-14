import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PhysicalActivity } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const PhysicalActivityStep: React.FC<Props> = ({ data, updateData }) => {
  const physicalActivity = data.physicalActivity as PhysicalActivity;

  const handleChange = (field: keyof PhysicalActivity, value: any) => {
    updateData('physicalActivity', { [field]: value });
  };

  const handleActivityChange = (activity: string, field: 'days' | 'minutes', value: any) => {
    updateData('physicalActivity', {
      ...physicalActivity,
      [activity]: {
        ...physicalActivity[activity as keyof PhysicalActivity],
        [field]: value
      }
    });
  };

  const activities = [
    { key: 'yoga', label: 'Yoga' },
    { key: 'exercise', label: 'Exercise' },
    { key: 'indoorGames', label: 'Indoor Games (e.g., Table Tennis)' },
    { key: 'outdoorGames', label: 'Outdoor Games (e.g., Cricket, Football)' },
    { key: 'playAfterSchool', label: 'Playing after school hours/household works' },
    { key: 'cycling', label: 'Bicycle (Self-transport)' },
    { key: 'walking', label: 'Walking' },
  ];

  const ActivityRow = ({ activity }: { activity: { key: string; label: string } }) => {
    const currentActivity = physicalActivity[activity.key as keyof PhysicalActivity] || { days: undefined, minutes: 'none' };
    
    const timeRanges = [
      { value: 'none', label: 'Select time range' },
      { value: 'less-than-1', label: '< 1 hr/day' },
      { value: '1-2', label: '1-2 hr/day' },
      { value: '2-3', label: '2-3 hr/day' },
      { value: 'more-than-3', label: '> 3 hr/day' }
    ];
    
    return (
      <div className="grid grid-cols-3 items-center gap-4 py-3 border-b last:border-b-0">
        <div className="text-sm font-medium col-span-1">{activity.label}</div>
        <div className="col-span-1">
          <Select
            value={currentActivity.days?.toString() || "none"}
            onValueChange={(value) => handleActivityChange(activity.key, 'days', value === "none" ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select days</SelectItem>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <Select
            value={currentActivity.minutes || 'none'}
            onValueChange={(value) => handleActivityChange(activity.key, 'minutes', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const calculateTotalActivityMinutes = () => {
    return activities.reduce((total, activity) => {
      const currentActivity = physicalActivity[activity.key as keyof PhysicalActivity];
      if (typeof currentActivity === 'object' && currentActivity !== null && 'days' in currentActivity && 'minutes' in currentActivity) {
        const activityData = currentActivity as { days: number; minutes: number };
        return total + ((activityData.days || 0) * (activityData.minutes || 0));
      }
      return total;
    }, (physicalActivity.ptFrequency || 0) * (physicalActivity.ptDuration || 0));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Physical Activity Assessment (Last 7 Days)</h3>
        <p className="text-gray-600">Tell us about your physical activities and exercise habits</p>
      </div>

      {/* PT Participation */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Physical Training (PT) Participation</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Do you participate in Physical Training classes?</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ptParticipation"
              checked={physicalActivity.participation}
              onCheckedChange={(checked) => handleChange('participation', checked)}
            />
            <Label htmlFor="ptParticipation" className="text-sm font-medium">I participate in PT (Physical Training) classes</Label>
          </div>

          {physicalActivity.participation && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="ptFrequency" className="text-sm font-medium">PT Classes per Week</Label>
                <Select
                  value={physicalActivity.ptFrequency?.toString() || "0"}
                  onValueChange={(value) => handleChange('ptFrequency', parseInt(value) || 0)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <SelectItem key={day} value={day.toString()}>{day} days</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ptDuration" className="text-sm font-medium">Duration per Class (minutes)</Label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={physicalActivity.ptDuration || 0}
                  onChange={(e) => handleChange('ptDuration', parseInt(e.target.value) || 0)}
                  placeholder="Enter duration"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ptActivityType" className="text-sm font-medium">Activity Type</Label>
                <Select
                  value={physicalActivity.ptActivityType || "outdoor"}
                  onValueChange={(value) => handleChange('ptActivityType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Activities */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Q4: School/College Activities</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Are you involved in any of the following activities?</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="scouts"
              checked={physicalActivity.scouts || false}
              onCheckedChange={(checked) => handleChange('scouts', checked)}
            />
            <Label htmlFor="scouts" className="text-sm font-medium">Scouts and Guides</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ncc"
              checked={physicalActivity.ncc || false}
              onCheckedChange={(checked) => handleChange('ncc', checked)}
            />
            <Label htmlFor="ncc" className="text-sm font-medium">NCC</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="otherActivities"
                checked={physicalActivity.otherActivities || false}
                onCheckedChange={(checked) => handleChange('otherActivities', checked)}
              />
              <Label htmlFor="otherActivities" className="text-sm font-medium">Others:</Label>
            </div>
            {physicalActivity.otherActivities && (
              <Input
                placeholder="Please specify other activities"
                value={physicalActivity.otherActivitiesDetail || ''}
                onChange={(e) => handleChange('otherActivitiesDetail', e.target.value)}
                className="ml-6 mt-1"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noActivities"
              checked={physicalActivity.noActivities || false}
              onCheckedChange={(checked) => handleChange('noActivities', checked)}
            />
            <Label htmlFor="noActivities" className="text-sm font-medium">None</Label>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Q5: Weekly Physical Activities</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            How many days per week do you engage in the following? 
            <br />
            <span className="text-sm text-blue-600">
              CDC Guidelines: Moderate to Vigorous Activities – min 60 min/day, 3 days/week for ages 6–17
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {activities.map((activity) => (
            <ActivityRow key={activity.key} activity={activity} />
          ))}
        </CardContent>
      </Card>

      {/* PT Participation Summary */}
      <Card className="bg-blue-50/50 border border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">PT Participation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">PT Participation Status:</span>
              <span className="text-sm text-blue-700">{physicalActivity.participation ? 'Active' : 'Not Participating'}</span>
            </div>
            {physicalActivity.participation && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Classes per Week:</span>
                  <span className="text-sm text-blue-700">{physicalActivity.ptFrequency} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Duration per Class:</span>
                  <span className="text-sm text-blue-700">{physicalActivity.ptDuration} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Total Weekly PT Minutes:</span>
                  <span className="text-sm text-blue-700">{physicalActivity.ptFrequency * physicalActivity.ptDuration} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Total Weekly Activity Minutes:</span>
                  <span className="text-sm text-blue-700">{calculateTotalActivityMinutes()} minutes</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityStep;
