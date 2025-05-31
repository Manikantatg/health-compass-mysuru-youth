
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
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

  const ActivitySlider = ({ field, label, max = 420 }: { field: keyof PhysicalActivity; label: string; max?: number }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {physicalActivity[field]} minutes/week
        </span>
      </div>
      <Slider
        value={[physicalActivity[field] as number]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={max}
        min={0}
        step={15}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0 min</span>
        <span>{max} min</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Physical Activity Assessment (Last 7 Days)</h3>
        <p className="text-gray-600">Tell us about your physical activities and exercise habits</p>
      </div>

      {/* PT Participation - Core Question */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>⚠️</span>
            <span>Physical Training (PT) Participation</span>
          </CardTitle>
          <CardDescription className="text-orange-700 font-medium">
            Caution: Do not remove or alter this question. It is a core component of this assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Q: I actively participate in PT (Physical Training) classes</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="ptParticipation"
                  checked={physicalActivity.participation}
                  onCheckedChange={(checked) => handleChange('participation', checked)}
                />
                <Label htmlFor="ptParticipation">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="ptNonParticipation"
                  checked={!physicalActivity.participation}
                  onCheckedChange={(checked) => handleChange('participation', !checked)}
                />
                <Label htmlFor="ptNonParticipation">No</Label>
              </div>
            </div>

            {physicalActivity.participation && (
              <div className="space-y-4 bg-green-50 p-4 rounded-md border">
                <Label className="text-base font-medium">If marked "Yes," please select one or more of the following activities you participate in:</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="outdoorGamesActivity"
                      checked={physicalActivity.outdoorGames > 0}
                      onCheckedChange={(checked) => handleChange('outdoorGames', checked ? 120 : 0)}
                    />
                    <Label htmlFor="outdoorGamesActivity">Outdoor Games (e.g., football, basketball, athletics, etc.)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indoorGamesActivity"
                      checked={physicalActivity.indoorGames > 0 || physicalActivity.yoga > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleChange('indoorGames', 60);
                          handleChange('yoga', 30);
                        } else {
                          handleChange('indoorGames', 0);
                          handleChange('yoga', 0);
                        }
                      }}
                    />
                    <Label htmlFor="indoorGamesActivity">Indoor Games (e.g., table tennis, yoga, badminton, etc.)</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
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
        </CardContent>
      </Card>

      {/* Physical Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Physical Activities</CardTitle>
          <CardDescription>How many minutes per week do you spend on these activities?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ActivitySlider field="yoga" label="Yoga" />
          <ActivitySlider field="exercise" label="Exercise" />
          <ActivitySlider field="indoorGames" label="Indoor Games (e.g., Table Tennis, Badminton)" />
          <ActivitySlider field="outdoorGames" label="Outdoor Games (e.g., Cricket, Football, Kho-Kho)" />
          <ActivitySlider field="playAfterSchool" label="Play after school hours / Help with household chores" />
          <ActivitySlider field="cycling" label="Self-transport via Bicycle" />
          <ActivitySlider field="walking" label="Walking" />
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
                {(physicalActivity.ptFrequency * physicalActivity.ptDuration) + 
                 physicalActivity.yoga + physicalActivity.exercise + physicalActivity.indoorGames + 
                 physicalActivity.outdoorGames + physicalActivity.playAfterSchool + 
                 physicalActivity.cycling + physicalActivity.walking} minutes
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm text-gray-600">
                WHO recommends at least 420 minutes (60 minutes daily) of moderate to vigorous physical activity per week for children and adolescents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityStep;
