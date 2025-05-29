
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MentalHealth } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const MentalHealthStep: React.FC<Props> = ({ data, updateData }) => {
  const mentalHealth = data.mentalHealth as MentalHealth;

  const handleChange = (field: keyof MentalHealth, value: any) => {
    updateData('mentalHealth', { [field]: value });
  };

  const bodyPerceptionLabels = ['Very Underweight', 'Underweight', 'Normal', 'Overweight', 'Very Overweight'];
  const mobilityLabels = ['No Issues', 'Minor Issues', 'Some Issues', 'Major Issues', 'Severe Issues'];

  const bodyImageOptions = [
    { value: 1, label: 'Very Thin' },
    { value: 2, label: 'Thin' },
    { value: 3, label: 'Slightly Thin' },
    { value: 4, label: 'Normal (Thin)' },
    { value: 5, label: 'Normal (Average)' },
    { value: 6, label: 'Normal (Fuller)' },
    { value: 7, label: 'Slightly Fuller' },
    { value: 8, label: 'Fuller' },
    { value: 9, label: 'Very Fuller' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Mental Health & Body Image Assessment</h3>
        <p className="text-gray-600">This helps us understand how you feel about yourself and your body</p>
      </div>

      {/* Body Perception */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Perception</CardTitle>
          <CardDescription>How do you perceive your current body weight?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">I think my body weight is:</Label>
              <span className="text-sm text-gray-600 font-medium">
                {bodyPerceptionLabels[mentalHealth.bodyPerception - 1]}
              </span>
            </div>
            <Slider
              value={[mentalHealth.bodyPerception]}
              onValueChange={(value) => handleChange('bodyPerception', value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Underweight</span>
              <span>Very Overweight</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bullying Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Experience</CardTitle>
          <CardDescription>Your experience with bullying or teasing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="bullyingExperience"
              checked={mentalHealth.bullyingExperience}
              onCheckedChange={(checked) => handleChange('bullyingExperience', checked)}
            />
            <Label htmlFor="bullyingExperience">
              I have experienced bullying or teasing about my appearance or weight
            </Label>
          </div>
          {mentalHealth.bullyingExperience && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                If you're experiencing bullying, please talk to a trusted adult like a teacher, parent, or counselor.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobility Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Physical Mobility</CardTitle>
          <CardDescription>Do you have any challenges with physical movement or activities?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Physical mobility challenges:</Label>
              <span className="text-sm text-gray-600 font-medium">
                {mobilityLabels[mentalHealth.mobilityIssues - 1]}
              </span>
            </div>
            <Slider
              value={[mentalHealth.mobilityIssues]}
              onValueChange={(value) => handleChange('mobilityIssues', value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>No Issues</span>
              <span>Severe Issues</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight Goals</CardTitle>
          <CardDescription>What would you like to do about your weight?</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={mentalHealth.weightGoal} onValueChange={(value) => handleChange('weightGoal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your weight goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">I want to lose weight</SelectItem>
              <SelectItem value="gain">I want to gain weight</SelectItem>
              <SelectItem value="maintain">I want to maintain my current weight</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Body Image Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Image Perception</CardTitle>
          <CardDescription>Which body image best represents how you see yourself?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select 
              value={mentalHealth.bodyImageSelection.toString()} 
              onValueChange={(value) => handleChange('bodyImageSelection', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select body image that represents you" />
              </SelectTrigger>
              <SelectContent>
                {bodyImageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.value}. {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-9 gap-2 mt-4">
              {bodyImageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange('bodyImageSelection', option.value)}
                  className={`p-2 text-xs border rounded-md transition-colors ${
                    mentalHealth.bodyImageSelection === option.value
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Summary */}
      <Card className="bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-900">Mental Health & Wellbeing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Body Perception:</strong> {bodyPerceptionLabels[mentalHealth.bodyPerception - 1]}
            </p>
            <p className="text-sm">
              <strong>Weight Goal:</strong> {mentalHealth.weightGoal.charAt(0).toUpperCase() + mentalHealth.weightGoal.slice(1)} weight
            </p>
            <p className="text-sm">
              <strong>Mobility:</strong> {mobilityLabels[mentalHealth.mobilityIssues - 1]}
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                Remember: Everyone's body is different and beautiful. Focus on being healthy and happy rather than comparing yourself to others.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthStep;
