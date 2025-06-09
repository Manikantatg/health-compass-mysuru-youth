import React from 'react';
import { Label } from '@/components/ui/label';
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

  const scaleLabels = ['Never', 'Rarely', 'Sometimes', 'Very often', 'Almost always'];
  const scaleOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Very often' },
    { value: 4, label: 'Almost always' }
  ];

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

  const RadioScale = ({ field, label }: { field: keyof EatingHabits; label: string }) => (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <RadioGroup
        value={eatingHabits[field]?.toString() || '0'}
        onValueChange={(value) => handleChange(field, parseInt(value))}
        className="flex flex-wrap gap-4"
      >
        {scaleOptions.map((option) => (
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
    <div className="space-y-6 font-['Inter']">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Nutrition Habits Assessment (Last 15 Days)</h3>
        <p className="text-gray-600">Select how often you consume these foods</p>
      </div>

      {foodCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-[#D0EBE4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#3F51B5]">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.items.map((item) => (
              <RadioScale
                key={item.key}
                field={item.key as keyof EatingHabits}
                label={item.label}
              />
            ))}
            
            {/* Add Non-Vegetarian Foods question after healthy foods */}
            {categoryIndex === 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <Label className="text-sm font-medium">Non-Vegetarian Foods?</Label>
                </div>
                <RadioGroup
                  value={eatingHabits.nonVegConsumption?.toString() || '0'}
                  onValueChange={(value) => handleChange('nonVegConsumption', parseInt(value))}
                  className="flex flex-wrap gap-4"
                >
                  {scaleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value.toString()} id={`nonVeg-${option.value}`} />
                      <Label htmlFor={`nonVeg-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary Card */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Healthy Foods</h4>
              <div className="space-y-1">
                {['cereals', 'pulses', 'vegetables', 'fruits', 'milkProducts'].map((key) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span>{scaleLabels[eatingHabits[key as keyof EatingHabits]]}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span>Non-Veg Foods:</span>
                  <span>{scaleLabels[eatingHabits.nonVegConsumption]}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 mb-2">Processed Foods</h4>
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
