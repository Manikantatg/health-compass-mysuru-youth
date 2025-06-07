
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EatingHabits } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const EatingHabitsStep: React.FC<Props> = ({ data, updateData }) => {
  const eatingHabits = data.eatingHabits as EatingHabits;

  const handleChange = (field: keyof EatingHabits, value: number) => {
    updateData('eatingHabits', { [field]: value });
  };

  const handleNonVegChange = (value: string) => {
    const numValue = value === 'never' ? 0 : value === 'rarely' ? 1 : 2;
    updateData('eatingHabits', { nonVegConsumption: numValue });
  };

  const scaleLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

  const foodCategories = [
    {
      title: 'Healthy Foods',
      description: 'How often do you consume these nutritious foods? (Last 15 Days)',
      items: [
        { key: 'cereals', label: 'Cereals (Rice, Wheat, Millets)' },
        { key: 'pulses', label: 'Pulses & Legumes' },
        { key: 'vegetables', label: 'Vegetables' },
        { key: 'fruits', label: 'Fruits' },
        { key: 'milkProducts', label: 'Milk & Dairy Products' },
      ]
    },
    {
      title: 'Processed & Sugary Foods',
      description: 'How often do you consume these foods? (Last 15 Days)',
      items: [
        { key: 'snacks', label: 'Snacks: Chips, Burger, Biscuits, Pizza, etc.' },
        { key: 'beverages', label: 'Beverages: Soft drinks, Energy drinks (Tang, Pediasure, Glucon-D, etc.)' },
        { key: 'sweets', label: 'Sweets & Desserts' },
      ]
    }
  ];

  const ScaleSlider = ({ field, label }: { field: keyof EatingHabits; label: string }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-medium">
          {scaleLabels[eatingHabits[field]]}
        </span>
      </div>
      <Slider
        value={[eatingHabits[field]]}
        onValueChange={(value) => handleChange(field, value[0])}
        max={4}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Never</span>
        <span>Always</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Eating Habits Assessment (Last 15 Days)</h3>
        <p className="text-gray-600">Rate how often you consume these foods on a scale from Never to Always</p>
      </div>

      {foodCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-[#D0EBE4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#3F51B5]">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.items.map((item) => (
              <ScaleSlider
                key={item.key}
                field={item.key as keyof EatingHabits}
                label={item.label}
              />
            ))}
            
            {/* Add Non-Vegetarian Foods question after healthy foods */}
            {categoryIndex === 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <Label className="text-sm font-medium">Do you consume Non-Vegetarian Foods?</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Examples include: Chicken, Fish, Mutton, Eggs, Seafood, Prawns, Lean Meats
                  </p>
                </div>
                <RadioGroup
                  value={eatingHabits.nonVegConsumption === 0 ? 'never' : eatingHabits.nonVegConsumption === 1 ? 'rarely' : 'always'}
                  onValueChange={handleNonVegChange}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="never" />
                    <Label htmlFor="never">Never</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rarely" id="rarely" />
                    <Label htmlFor="rarely">Rarely</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="always" id="always" />
                    <Label htmlFor="always">Always</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary Card */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Eating Habits Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Healthy Foods Score</h4>
              <div className="space-y-1">
                {['cereals', 'pulses', 'vegetables', 'fruits', 'milkProducts'].map((key) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span>{scaleLabels[eatingHabits[key as keyof EatingHabits]]}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span>Non-Veg Foods:</span>
                  <span>{eatingHabits.nonVegConsumption === 0 ? 'Never' : eatingHabits.nonVegConsumption === 1 ? 'Rarely' : 'Always'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 mb-2">Processed Foods Score</h4>
              <div className="space-y-1">
                {['snacks', 'beverages', 'sweets'].map((key) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span>{scaleLabels[eatingHabits[key as keyof EatingHabits]]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EatingHabitsStep;
