
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  const bodyPerceptionLabels = ['Very underweight', 'Slightly underweight', 'About the right weight', 'Slightly overweight', 'Very overweight'];
  const frequencyLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost Always'];
  const bodyImageSatisfactionLabels = ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'];

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

  const FrequencySlider = ({ field, label }: { field: keyof MentalHealth; label: string }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {frequencyLabels[mentalHealth[field] as number]}
        </span>
      </div>
      <Slider
        value={[mentalHealth[field] as number]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={4}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Never</span>
        <span>Almost Always</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">🧠 Mental Health and Wellbeing Assessment (Last 15 Days)</h3>
        <p className="text-gray-600">This section assesses students' perceptions of their mental health and body image</p>
      </div>

      {/* Q1: Body Weight Perception */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q1: How do you describe your weight?</CardTitle>
          <CardDescription>Please select the option that best describes how you view your current weight</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={mentalHealth.bodyPerception?.toString() || "3"}
            onValueChange={(value) => handleChange('bodyPerception', parseInt(value))}
            className="space-y-2"
          >
            {bodyPerceptionLabels.map((label, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={(index + 1).toString()} id={`weight-${index}`} />
                <Label htmlFor={`weight-${index}`} className="cursor-pointer">
                  {String.fromCharCode(65 + index)}. {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Q2: Weight Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q2: What are you trying to do about your weight?</CardTitle>
          <CardDescription>Select your current weight goal</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={mentalHealth.weightGoal || "maintain"}
            onValueChange={(value) => handleChange('weightGoal', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lose" id="weight-lose" />
              <Label htmlFor="weight-lose" className="cursor-pointer">A. Lose weight</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gain" id="weight-gain" />
              <Label htmlFor="weight-gain" className="cursor-pointer">B. Gain weight</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maintain" id="weight-maintain" />
              <Label htmlFor="weight-maintain" className="cursor-pointer">C. Stay the same weight</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Q3: Bullying Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q3: Are you being bullied for weight by friends or family?</CardTitle>
          <CardDescription>Your experience with bullying or teasing about weight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="bullyingExperience"
              checked={mentalHealth.bullyingExperience}
              onCheckedChange={(checked) => handleChange('bullyingExperience', checked)}
            />
            <Label htmlFor="bullyingExperience">
              Yes, I have experienced bullying or teasing about my weight
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

      {/* Q4: Mental Health Screening */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q4: Mental Health and Wellbeing</CardTitle>
          <CardDescription>Please rate how often you experience these situations (Last 15 Days)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FrequencySlider field="difficultyWalking" label="It is hard for me to walk" />
          <FrequencySlider field="difficultyRunning" label="It is hard for me to run" />
          <FrequencySlider field="difficultySports" label="It is hard for me to do sports activity or exercise" />
          <FrequencySlider field="difficultyAttention" label="It is hard to pay attention at school" />
          <FrequencySlider field="forgetThings" label="I forget things" />
          <FrequencySlider field="troubleKeepingUp" label="I have trouble keeping up with my work or studies" />
          <FrequencySlider field="feelLonely" label="I feel lonely and not interested in my work" />
          <FrequencySlider field="wantEatLess" label="I feel I want to eat less to lose weight" />
        </CardContent>
      </Card>

      {/* Q5: Body Image Visual Reference Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q5: Body Image Perception (Current & Future)</CardTitle>
          <CardDescription>Select the body image that best represents how you see yourself currently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Floating Body Image Reference Chart */}
            <div className="float-right w-1/3 ml-6 mb-4 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/f412f968-159e-4161-b48b-d6cf61b6d187.png" 
                alt="Body Image Reference Chart"
                className="w-full h-auto"
              />
              <div className="p-2 bg-gray-50 text-xs text-center text-gray-600">
                Body Image Reference Chart
              </div>
            </div>

            <div className="space-y-6">
              {/* Current Body Image Perception */}
              <div className="space-y-4">
                <Label className="text-base font-medium">How do you currently perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How do you see your body as it is right now?)</p>
                <RadioGroup
                  value={mentalHealth.currentBodyImageSatisfaction?.toString() || "3"}
                  onValueChange={(value) => handleChange('currentBodyImageSatisfaction', parseInt(value))}
                  className="space-y-2"
                >
                  {bodyImageSatisfactionLabels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={(index + 1).toString()} id={`current-${index}`} />
                      <Label htmlFor={`current-${index}`} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Desired Body Image Perception */}
              <div className="space-y-4">
                <Label className="text-base font-medium">How would you ideally like to perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How would you ideally like to see your body?)</p>
                <RadioGroup
                  value={mentalHealth.desiredBodyImageSatisfaction?.toString() || "4"}
                  onValueChange={(value) => handleChange('desiredBodyImageSatisfaction', parseInt(value))}
                  className="space-y-2"
                >
                  {bodyImageSatisfactionLabels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={(index + 1).toString()} id={`desired-${index}`} />
                      <Label htmlFor={`desired-${index}`} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Body Shape Selection */}
              <div className="space-y-4 clear-both">
                <Label className="text-base font-medium">Body Shape Selection</Label>
                <p className="text-sm text-gray-600">Select the number from the reference chart that best represents your current body shape</p>
                <Select 
                  value={mentalHealth.bodyImageSelection?.toString() || "5"} 
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Summary */}
      <Card className="bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-900">Mental Health & Wellbeing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Current Body Image:</strong> {bodyImageSatisfactionLabels[(mentalHealth.currentBodyImageSatisfaction || 3) - 1]}
            </p>
            <p className="text-sm">
              <strong>Desired Body Image:</strong> {bodyImageSatisfactionLabels[(mentalHealth.desiredBodyImageSatisfaction || 4) - 1]}
            </p>
            <p className="text-sm">
              <strong>Body Weight Perception:</strong> {bodyPerceptionLabels[(mentalHealth.bodyPerception || 3) - 1]}
            </p>
            <p className="text-sm">
              <strong>Weight Goal:</strong> {mentalHealth.weightGoal?.charAt(0).toUpperCase() + (mentalHealth.weightGoal?.slice(1) || 'maintain')} weight
            </p>
            <p className="text-sm">
              <strong>Body Image Selection:</strong> {bodyImageOptions.find(opt => opt.value === mentalHealth.bodyImageSelection)?.label || 'Not selected'}
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
