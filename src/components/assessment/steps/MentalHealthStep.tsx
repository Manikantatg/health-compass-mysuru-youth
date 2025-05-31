
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

  const bodyPerceptionLabels = ['Very Underweight', 'Underweight', 'Normal', 'Overweight', 'Very Overweight'];
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

      {/* Body Image Perception - Current vs Desired */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Image Perception</CardTitle>
          <CardDescription>How you see and feel about your body</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Body Image Perception */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Q1: Please rate your current perception of your body image</Label>
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
            <Label className="text-base font-medium">Q2: Please rate your desired perception of your body image</Label>
            <p className="text-sm text-gray-600">(How would you ideally like to perceive your body?)</p>
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
        </CardContent>
      </Card>

      {/* Body Perception */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Weight Perception</CardTitle>
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

      {/* Body Image Visual Reference Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Image Reference Chart</CardTitle>
          <CardDescription>Select the body image that best represents how you see yourself currently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Body Shape Icons Grid */}
            <div className="grid grid-cols-9 gap-2">
              {bodyImageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange('bodyImageSelection', option.value)}
                  className={`p-3 text-xs border rounded-md transition-all duration-200 ${
                    mentalHealth.bodyImageSelection === option.value
                      ? 'bg-blue-100 border-blue-500 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {/* SVG Body Shape Icons */}
                  <div className="w-8 h-12 mx-auto mb-1">
                    <svg viewBox="0 0 24 48" className="w-full h-full">
                      {/* Simple body shape representation */}
                      <ellipse 
                        cx="12" 
                        cy="8" 
                        rx={2 + (option.value - 1) * 0.3} 
                        ry="3" 
                        fill="currentColor" 
                        opacity="0.7"
                      />
                      <rect 
                        x={12 - (3 + (option.value - 1) * 0.5)} 
                        y="11" 
                        width={6 + (option.value - 1) * 1} 
                        height="20" 
                        rx="2" 
                        fill="currentColor" 
                        opacity="0.7"
                      />
                      <ellipse 
                        cx="12" 
                        cy="35" 
                        rx={2 + (option.value - 1) * 0.4} 
                        ry="8" 
                        fill="currentColor" 
                        opacity="0.7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs">{option.value}</span>
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-2">
              <p>Select the body shape that best represents how you see yourself (1 = Very Thin, 9 = Very Fuller)</p>
            </div>

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

      {/* Mental Health and Wellbeing Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mental Health and Wellbeing</CardTitle>
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
              <strong>Body Weight Perception:</strong> {bodyPerceptionLabels[mentalHealth.bodyPerception - 1]}
            </p>
            <p className="text-sm">
              <strong>Weight Goal:</strong> {mentalHealth.weightGoal.charAt(0).toUpperCase() + mentalHealth.weightGoal.slice(1)} weight
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
