
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SedentaryBehavior } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SedentaryBehaviorStep: React.FC<Props> = ({ data, updateData }) => {
  const sedentaryBehavior = data.sedentaryBehavior as SedentaryBehavior;

  const handleChange = (field: keyof SedentaryBehavior, value: number) => {
    updateData('sedentaryBehavior', { [field]: value });
  };

  const timeLabels = ['0-1 hrs', '1-2 hrs', '2-3 hrs', '3-4 hrs', '4+ hrs'];

  const ActivitySlider = ({ field, label }: { field: keyof SedentaryBehavior; label: string }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {timeLabels[sedentaryBehavior[field]]}
        </span>
      </div>
      <Slider
        value={[sedentaryBehavior[field]]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={4}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0-1 hrs</span>
        <span>4+ hrs</span>
      </div>
    </div>
  );

  const activities = [
    {
      title: 'Screen Time Activities',
      description: 'How much time do you spend daily on these screen-based activities?',
      items: [
        { key: 'tvTime', label: 'Watching TV/Movies' },
        { key: 'mobileTime', label: 'Mobile Phone/Tablet Usage' },
        { key: 'gamingTime', label: 'Video Gaming' },
      ]
    },
    {
      title: 'Study & Learning Activities',
      description: 'Time spent on educational activities per day',
      items: [
        { key: 'homeworkTime', label: 'Homework & Assignments' },
        { key: 'readingTime', label: 'Reading Books/Magazines' },
        { key: 'tuitionTime', label: 'Tuition Classes' },
      ]
    },
    {
      title: 'Other Activities',
      description: 'Additional sedentary activities',
      items: [
        { key: 'musicTime', label: 'Listening to Music/Podcasts' },
      ]
    }
  ];

  const totalScreenTime = sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime + sedentaryBehavior.gamingTime;
  const totalSedentaryTime = Object.values(sedentaryBehavior).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sedentary Behavior Assessment</h3>
        <p className="text-gray-600">Track how much time you spend on different sedentary activities each day</p>
      </div>

      {activities.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.items.map((item) => (
              <ActivitySlider
                key={item.key}
                field={item.key as keyof SedentaryBehavior}
                label={item.label}
              />
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-900">Screen Time Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Screen Time:</span>
                <span className="font-bold">{timeLabels[Math.min(totalScreenTime, 4)]}</span>
              </div>
              <div className="text-xs text-gray-600">
                Recommended: Less than 2 hours for recreational screen time
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Total Sedentary Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Total:</span>
                <span className="font-bold">{timeLabels[Math.min(totalSedentaryTime, 4)]}</span>
              </div>
              <div className="text-xs text-gray-600">
                Tip: Break up sitting time with physical activity every hour
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-900">Health Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Limit recreational screen time to less than 2 hours per day</li>
            <li>• Take a 5-minute break every hour when studying or using devices</li>
            <li>• Use a standing desk or exercise ball while doing homework</li>
            <li>• Replace some screen time with physical activities or hobbies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SedentaryBehaviorStep;
