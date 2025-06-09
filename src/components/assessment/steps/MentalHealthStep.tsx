import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MentalHealth } from '../../../types/assessment';

interface Props {
  data: {
    mentalHealth: MentalHealth;
  };
  updateData: (step: string, data: Partial<MentalHealth>) => void;
}

const MentalHealthStep: React.FC<Props> = ({ data, updateData }) => {
  const mentalHealth = data.mentalHealth;

  const handleChange = (field: keyof MentalHealth, value: MentalHealth[keyof MentalHealth]) => {
    updateData('mentalHealth', { [field]: value });
  };

  const bodyPerceptionLabels = ['Very underweight', 'Slightly underweight', 'About the right weight', 'Slightly overweight', 'Very overweight'];
  const frequencyOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost Always' }
  ];

  const FrequencyRadio = ({ field, label }: { field: keyof MentalHealth; label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={mentalHealth[field]?.toString() || "0"}
        onValueChange={(value) => handleChange(field, parseInt(value) as MentalHealth[keyof MentalHealth])}
        className="flex flex-wrap gap-4"
      >
        {frequencyOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value.toString()} id={`${field}-${option.value}`} />
            <Label htmlFor={`${field}-${option.value}`} className="text-sm cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
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
            onValueChange={(value) => handleChange('bodyPerception', parseInt(value) as MentalHealth[keyof MentalHealth])}
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
            onValueChange={(value) => handleChange('weightGoal', value as MentalHealth[keyof MentalHealth])}
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
              onCheckedChange={(checked) => handleChange('bullyingExperience', checked as MentalHealth[keyof MentalHealth])}
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
          <FrequencyRadio field="difficultyWalking" label="It is hard for me to walk" />
          <FrequencyRadio field="difficultyRunning" label="It is hard for me to run" />
          <FrequencyRadio field="difficultySports" label="It is hard for me to do sports activity or exercise" />
          <FrequencyRadio field="difficultyAttention" label="It is hard to pay attention at school" />
          <FrequencyRadio field="forgetThings" label="I forget things" />
          <FrequencyRadio field="troubleKeepingUp" label="I have trouble keeping up with my work or studies" />
          <FrequencyRadio field="feelLonely" label="I feel lonely and not interested in my work" />
          <FrequencyRadio field="wantEatLess" label="I feel I want to eat less to lose weight" />
        </CardContent>
      </Card>

      {/* Q5: Body Image Visual Reference Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q5: Body Image Perception (Current & Future)</CardTitle>
          <CardDescription>Use the body image reference chart to select numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Questions Section - Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Current Body Image Perception */}
              <div className="space-y-4">
                <Label className="text-base font-medium">1. How do you currently perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How do you see your body as it is right now?)</p>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="currentBodyImage" className="text-sm">Enter the number:</Label>
                  <Input
                    id="currentBodyImage"
                    type="number"
                    min="1"
                    max="9"
                    value={mentalHealth.currentBodyImageSatisfaction || 1}
                    onChange={(e) => handleChange('currentBodyImageSatisfaction', parseInt(e.target.value) || 1 as MentalHealth[keyof MentalHealth])}
                    className="w-20"
                    placeholder="1-9"
                    onKeyDown={(e) => {
                      // Allow continuous number entry
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Desired Body Image Perception */}
              <div className="space-y-4">
                <Label className="text-base font-medium">2. How do you desire to perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How would you ideally like to see your body?)</p>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="desiredBodyImage" className="text-sm">Enter the number:</Label>
                  <Input
                    id="desiredBodyImage"
                    type="number"
                    min="1"
                    max="9"
                    value={mentalHealth.desiredBodyImageSatisfaction || 1}
                    onChange={(e) => handleChange('desiredBodyImageSatisfaction', parseInt(e.target.value) || 1 as MentalHealth[keyof MentalHealth])}
                    className="w-20"
                    placeholder="1-9"
                    onKeyDown={(e) => {
                      // Allow continuous number entry
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Body Image Reference Chart - Right Column */}
            <div className="lg:col-span-5">
              <Card className="h-full border-2 border-primary/10">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Body Image Scale</h4>
                      <p className="text-sm text-muted-foreground">
                        Reference guide for perception ratings
                      </p>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src="https://www.researchgate.net/publication/325991284/figure/fig1/AS:961371055337473@1606220129184/Body-somatotypes-This-figure-shows-the-body-somatotypes-from-which-participants-were.gif" 
                        alt="Body Image Reference Chart"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Summary */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Mental Health Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Body Image & Weight</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Current Weight Perception:</strong> {bodyPerceptionLabels[mentalHealth.bodyPerception - 1]}</p>
                <p><strong>Weight Goal:</strong> {mentalHealth.weightGoal === 'lose' ? 'Lose weight' : mentalHealth.weightGoal === 'gain' ? 'Gain weight' : 'Maintain weight'}</p>
                <p><strong>Bullying Experience:</strong> {mentalHealth.bullyingExperience ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mental Health Indicators</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Physical Activity Difficulty:</strong> {frequencyOptions[mentalHealth.difficultySports]?.label}</p>
                <p><strong>Attention Issues:</strong> {frequencyOptions[mentalHealth.difficultyAttention]?.label}</p>
                <p><strong>Academic Performance:</strong> {frequencyOptions[mentalHealth.troubleKeepingUp]?.label}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white border border-indigo-200 rounded-md">
            <p className="text-sm text-indigo-800">
              Mental health and body image are important aspects of overall wellbeing. If you're experiencing significant 
              difficulties, please talk to a trusted adult or healthcare professional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthStep;
