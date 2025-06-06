
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MentalHealth } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const MentalHealthStep: React.FC<Props> = ({ data, updateData }) => {
  const mentalHealth = data.mentalHealth as MentalHealth;
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (field: keyof MentalHealth, value: any) => {
    updateData('mentalHealth', { [field]: value });
  };

  const bodyPerceptionLabels = ['Very underweight', 'Slightly underweight', 'About the right weight', 'Slightly overweight', 'Very overweight'];
  const frequencyLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost Always'];

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - imagePosition.x;
    const offsetY = e.clientY - rect.top - imagePosition.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setImagePosition({
        x: moveEvent.clientX - rect.left - offsetX,
        y: moveEvent.clientY - rect.top - offsetY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
          <CardDescription>Use the body image reference chart to select numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4">
            {/* Draggable Body Image Reference Chart */}
            <div
              className={`absolute w-80 rounded-xl shadow-lg overflow-hidden bg-white cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
              style={{
                left: imagePosition.x,
                top: imagePosition.y,
                transform: 'translate(0, 0)'
              }}
              onMouseDown={handleMouseDown}
            >
              <img 
                src="https://www.researchgate.net/publication/325991284/figure/fig1/AS:961371055337473@1606220129184/Body-somatotypes-This-figure-shows-the-body-somatotypes-from-which-participants-were.gif" 
                alt="Body Image Reference Chart"
                className="w-full h-auto"
                draggable={false}
              />
              <div className="p-2 bg-gray-50 text-xs text-center text-gray-600">
                Body Image Reference Chart (Drag to move)
              </div>
            </div>

            <div className="space-y-6 pt-4">
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
                    value={mentalHealth.currentBodyImageSatisfaction || ''}
                    onChange={(e) => handleChange('currentBodyImageSatisfaction', parseInt(e.target.value) || 0)}
                    className="w-20"
                    placeholder="1-9"
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
                    value={mentalHealth.desiredBodyImageSatisfaction || ''}
                    onChange={(e) => handleChange('desiredBodyImageSatisfaction', parseInt(e.target.value) || 0)}
                    className="w-20"
                    placeholder="1-9"
                  />
                </div>
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
              <strong>Current Body Image (Number):</strong> {mentalHealth.currentBodyImageSatisfaction || 'Not selected'}
            </p>
            <p className="text-sm">
              <strong>Desired Body Image (Number):</strong> {mentalHealth.desiredBodyImageSatisfaction || 'Not selected'}
            </p>
            <p className="text-sm">
              <strong>Body Weight Perception:</strong> {bodyPerceptionLabels[(mentalHealth.bodyPerception || 3) - 1]}
            </p>
            <p className="text-sm">
              <strong>Weight Goal:</strong> {mentalHealth.weightGoal?.charAt(0).toUpperCase() + (mentalHealth.weightGoal?.slice(1) || 'maintain')} weight
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
