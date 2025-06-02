
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  const handleActivityChange = (activity: string, field: 'days' | 'minutes', value: number) => {
    const activityData = physicalActivity[activity as keyof PhysicalActivity] || { days: 0, minutes: 0 };
    updateData('physicalActivity', { 
      [activity]: { 
        ...activityData, 
        [field]: value 
      } 
    });
  };

  const activities = [
    { key: 'yoga', label: 'Yoga' },
    { key: 'exercise', label: 'Exercise' },
    { key: 'indoorGames', label: 'Indoor Games (Table Tennis, Badminton)' },
    { key: 'outdoorGames', label: 'Outdoor Games (Cricket, Football, Kho-Kho)' },
    { key: 'playAfterSchool', label: 'Play/Household Chores' },
    { key: 'cycling', label: 'Bicycle (Self-transport)' },
    { key: 'walking', label: 'Walking' },
  ];

  const ActivityRow = ({ activity }: { activity: { key: string; label: string } }) => {
    const activityData = physicalActivity[activity.key as keyof PhysicalActivity] || { days: 0, minutes: 0 };
    
    return (
      <tr className="border-b">
        <td className="py-3 px-4 text-sm font-medium">{activity.label}</td>
        <td className="py-3 px-4">
          <Select
            value={activityData.days?.toString() || "0"}
            onValueChange={(value) => handleActivityChange(activity.key, 'days', parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-4">
          <Input
            type="number"
            min="0"
            max="420"
            value={activityData.minutes || 0}
            onChange={(e) => handleActivityChange(activity.key, 'minutes', parseInt(e.target.value) || 0)}
            className="w-24"
            placeholder="0"
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Physical Activity Assessment (Last 7 Days)</h3>
        <p className="text-gray-600">Tell us about your physical activities and exercise habits</p>
      </div>

      {/* PT Participation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Physical Training (PT) Participation</CardTitle>
          <CardDescription>Basic information about your PE classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ptParticipation"
              checked={physicalActivity.participation}
              onCheckedChange={(checked) => handleChange('participation', checked)}
            />
            <Label htmlFor="ptParticipation">I actively participate in PT (Physical Training) classes</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ptFrequency">PT Classes per Week</Label>
              <Input
                id="ptFrequency"
                type="number"
                min="0"
                max="7"
                value={physicalActivity.ptFrequency}
                onChange={(e) => handleChange('ptFrequency', parseInt(e.target.value) || 0)}
                placeholder="0-7 days"
              />
            </div>
            <div>
              <Label htmlFor="ptDuration">Duration per Class (minutes)</Label>
              <Input
                id="ptDuration"
                type="number"
                min="0"
                max="120"
                value={physicalActivity.ptDuration}
                onChange={(e) => handleChange('ptDuration', parseInt(e.target.value) || 0)}
                placeholder="e.g., 45"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q4: School/College Activities</CardTitle>
          <CardDescription>Are you involved in any of the following activities?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="scouts"
              checked={physicalActivity.scouts || false}
              onCheckedChange={(checked) => handleChange('scouts', checked)}
            />
            <Label htmlFor="scouts">Scouts and Guides</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ncc"
              checked={physicalActivity.ncc || false}
              onCheckedChange={(checked) => handleChange('ncc', checked)}
            />
            <Label htmlFor="ncc">NCC</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="otherActivities"
                checked={physicalActivity.otherActivities || false}
                onCheckedChange={(checked) => handleChange('otherActivities', checked)}
              />
              <Label htmlFor="otherActivities">Others:</Label>
            </div>
            {physicalActivity.otherActivities && (
              <Input
                placeholder="Please specify other activities"
                value={physicalActivity.otherActivitiesDetail || ''}
                onChange={(e) => handleChange('otherActivitiesDetail', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q5: Weekly Physical Activities</CardTitle>
          <CardDescription>
            How many days per week do you engage in the following? 
            <br />
            <span className="text-sm text-blue-600">
              CDC Guidelines: Moderate to Vigorous Activities – min 60 min/day, 3 days/week for ages 6–17
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Activity</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Days per Week (0-7)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Minutes per Day (0-420)</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <ActivityRow key={activity.key} activity={activity} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg text-green-900">Physical Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Weekly Activity Score</h4>
              <p className="text-2xl font-bold text-green-700">
                {activities.reduce((total, activity) => {
                  const activityData = physicalActivity[activity.key as keyof PhysicalActivity] || { days: 0, minutes: 0 };
                  return total + (activityData.days * activityData.minutes);
                }, (physicalActivity.ptFrequency * physicalActivity.ptDuration))} minutes
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">CDC Recommendation</h4>
              <p className="text-sm text-gray-600">
                420 minutes (60 minutes daily) of moderate to vigorous physical activity per week for children and adolescents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityStep;
