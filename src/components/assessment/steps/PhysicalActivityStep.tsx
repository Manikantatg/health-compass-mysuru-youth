import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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

  const ActivitySlider = ({ field, label, max = 7 }: { field: keyof PhysicalActivity; label: string; max?: number }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {physicalActivity[field]} {max === 7 ? 'hours/week' : 'days/week'}
        </span>
      </div>
      <Slider
        value={[physicalActivity[field] as number]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={max}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Physical Activity Assessment</h3>
        <p className="text-gray-600">Tell us about your physical activities and exercise habits</p>
      </div>

      {/* School Physical Training */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">School Physical Training</CardTitle>
          <CardDescription>Information about your school's physical education program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ptFrequency">PT Classes per Week</Label>
              <Input
                id="ptFrequency"
                type="number"
                min="0"
                max="6"
                value={physicalActivity.ptFrequency}
                onChange={(e) => handleChange('ptFrequency', parseInt(e.target.value) || 0)}
                placeholder="0-6 days"
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

          <div className="flex items-center space-x-2">
            <Switch
              id="participation"
              checked={physicalActivity.participation}
              onCheckedChange={(checked) => handleChange('participation', checked)}
            />
            <Label htmlFor="participation">I actively participate in PT classes</Label>
          </div>
        </CardContent>
      </Card>

      {/* Sports & Games */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sports & Games</CardTitle>
          <CardDescription>How many hours per week do you spend on these activities?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ActivitySlider field="indoorGames" label="Indoor Games (Chess, Carrom, etc.)" />
          <ActivitySlider field="outdoorGames" label="Outdoor Games (Cricket, Football, etc.)" />
        </CardContent>
      </Card>

      {/* Other Physical Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Physical Activities</CardTitle>
          <CardDescription>Hours per week spent on these activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ActivitySlider field="yoga" label="Yoga & Meditation" />
          <ActivitySlider field="dance" label="Dancing" />
          <ActivitySlider field="swimming" label="Swimming" />
          <ActivitySlider field="cycling" label="Cycling" />
          <ActivitySlider field="walking" label="Walking/Jogging" />
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
                {physicalActivity.ptFrequency + physicalActivity.indoorGames + physicalActivity.outdoorGames + 
                 physicalActivity.yoga + physicalActivity.dance + physicalActivity.swimming + 
                 physicalActivity.cycling + physicalActivity.walking} hours
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm text-gray-600">
                WHO recommends at least 60 minutes of moderate to vigorous physical activity daily for children and adolescents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityStep;
