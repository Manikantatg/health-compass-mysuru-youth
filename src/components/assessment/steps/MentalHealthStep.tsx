import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Helper to prevent Enter key from submitting the parent form
  const preventEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const bodyPerceptionLabels = ['Very underweight', 'Slightly underweight', 'About the right weight', 'Slightly overweight', 'Very overweight'];
  const frequencyOptions = [
    { value: "none", label: "Select frequency" },
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost Always' }
  ];

  const FrequencyDropdown = ({ field, label }: { field: keyof MentalHealth; label: string }) => (
    <div className="space-y-3">
      <Label htmlFor={`mentalHealth-${field}`} className="text-sm font-medium">{label}</Label>
      <Select
        id={`mentalHealth-${field}`}
        name={field}
        autoComplete="off"
        value={mentalHealth[field]?.toString() || "none"}
        onValueChange={(value) => handleChange(field, value === "none" ? undefined : parseInt(value) as MentalHealth[keyof MentalHealth])}
        onKeyDown={preventEnterSubmit}
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
          <Label htmlFor="mentalHealth-bodyPerceptionSelect" className="text-sm font-medium">Q1: How do you describe your weight?</Label>
          <Select
            id="mentalHealth-bodyPerceptionSelect"
            name="bodyPerception"
            autoComplete="off"
            value={mentalHealth.bodyPerception?.toString() || "none"}
            onValueChange={(value) => handleChange('bodyPerception', value === "none" ? undefined : parseInt(value) as MentalHealth[keyof MentalHealth])}
            onKeyDown={preventEnterSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select body perception" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select body perception</SelectItem>
              {bodyPerceptionLabels.map((label, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {String.fromCharCode(65 + index)}. {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Q2: Weight Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Q2: What are you trying to do about your weight?</CardTitle>
          <CardDescription>Select your current weight goal</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="mentalHealth-weightGoal" className="text-sm font-medium">Q2: What are you trying to do about your weight?</Label>
          <Select
            id="mentalHealth-weightGoal"
            name="weightGoal"
            autoComplete="off"
            value={mentalHealth.weightGoal || "none"}
            onValueChange={(value) => handleChange('weightGoal', value === "none" ? undefined : value as MentalHealth[keyof MentalHealth])}
            onKeyDown={preventEnterSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select weight goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select weight goal</SelectItem>
              <SelectItem value="lose">Lose weight</SelectItem>
              <SelectItem value="gain">Gain weight</SelectItem>
              <SelectItem value="maintain">Stay the same weight</SelectItem>
            </SelectContent>
          </Select>
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
              name="bullyingExperience"
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
          <FrequencyDropdown field="difficultyWalking" label="It is hard for me to walk" />
          <FrequencyDropdown field="difficultyRunning" label="It is hard for me to run" />
          <FrequencyDropdown field="difficultySports" label="It is hard for me to do sports activity or exercise" />
          <FrequencyDropdown field="difficultyAttention" label="It is hard to pay attention at school" />
          <FrequencyDropdown field="forgetThings" label="I forget things" />
          <FrequencyDropdown field="troubleKeepingUp" label="I have trouble keeping up with my work or studies" />
          <FrequencyDropdown field="feelLonely" label="I feel lonely and not interested in my work" />
          <FrequencyDropdown field="wantEatLess" label="I feel I want to eat less to lose weight" />
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
                <Label htmlFor="mentalHealth-currentBodyImageSatisfaction" className="text-base font-medium">1. How do you currently perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How do you see your body as it is right now?)</p>
                <Select
                  id="mentalHealth-currentBodyImageSatisfaction"
                  name="currentBodyImageSatisfaction"
                  autoComplete="off"
                  value={mentalHealth.currentBodyImageSatisfaction?.toString() || "none"}
                  onValueChange={(value) => handleChange('currentBodyImageSatisfaction', value === "none" ? undefined : parseInt(value) as MentalHealth[keyof MentalHealth])}
                  onKeyDown={preventEnterSubmit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a number (1-9)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a number (1-9)</SelectItem>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desired Body Image Perception */}
              <div className="space-y-4">
                <Label htmlFor="mentalHealth-desiredBodyImageSatisfaction" className="text-base font-medium">2. How do you desire to perceive your body image?</Label>
                <p className="text-sm text-gray-600">(How would you ideally like to see your body?)</p>
                <Select
                  id="mentalHealth-desiredBodyImageSatisfaction"
                  name="desiredBodyImageSatisfaction"
                  autoComplete="off"
                  value={mentalHealth.desiredBodyImageSatisfaction?.toString() || "none"}
                  onValueChange={(value) => handleChange('desiredBodyImageSatisfaction', value === "none" ? undefined : parseInt(value) as MentalHealth[keyof MentalHealth])}
                  onKeyDown={preventEnterSubmit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a number (1-9)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a number (1-9)</SelectItem>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <p>
                  <strong>Current Weight Perception:</strong>{' '}
                  {mentalHealth.bodyPerception ? bodyPerceptionLabels[mentalHealth.bodyPerception - 1] : 'Not selected'}
                </p>
                <p>
                  <strong>Weight Goal:</strong>{' '}
                  {mentalHealth.weightGoal === 'lose' 
                    ? 'Lose weight' 
                    : mentalHealth.weightGoal === 'gain' 
                      ? 'Gain weight' 
                      : mentalHealth.weightGoal === 'maintain'
                        ? 'Maintain weight'
                        : 'Not selected'}
                </p>
                <p>
                  <strong>Bullying Experience:</strong>{' '}
                  {mentalHealth.bullyingExperience === undefined 
                    ? 'Not selected' 
                    : mentalHealth.bullyingExperience 
                      ? 'Yes' 
                      : 'No'}
                </p>
                <p>
                  <strong>Current Body Image:</strong>{' '}
                  {mentalHealth.currentBodyImageSatisfaction 
                    ? `Rating: ${mentalHealth.currentBodyImageSatisfaction}` 
                    : 'Not selected'}
                </p>
                <p>
                  <strong>Desired Body Image:</strong>{' '}
                  {mentalHealth.desiredBodyImageSatisfaction 
                    ? `Rating: ${mentalHealth.desiredBodyImageSatisfaction}` 
                    : 'Not selected'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mental Health Indicators</h4>
              <div className="space-y-1 text-sm">
                {[
                  { field: 'difficultyWalking', label: 'Difficulty Walking' },
                  { field: 'difficultyRunning', label: 'Difficulty Running' },
                  { field: 'difficultySports', label: 'Difficulty with Sports' },
                  { field: 'difficultyAttention', label: 'Difficulty Paying Attention' },
                  { field: 'forgetThings', label: 'Forgetfulness' },
                  { field: 'troubleKeepingUp', label: 'Trouble Keeping Up' },
                  { field: 'feelLonely', label: 'Feeling Lonely' },
                  { field: 'wantEatLess', label: 'Wanting to Eat Less' }
                ].map(({ field, label }) => (
                  <p key={field}>
                    <strong>{label}:</strong>{' '}
                    {mentalHealth[field] === undefined 
                      ? 'Not selected' 
                      : frequencyOptions.find(opt => opt.value === mentalHealth[field])?.label || 'Not selected'}
                  </p>
                ))}
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
