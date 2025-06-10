import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocioDemographic } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SocioDemographicStep: React.FC<Props> = ({ data, updateData }) => {
  const socioDemographic = data.socioDemographic as SocioDemographic;

  const handleChange = (field: keyof SocioDemographic, value: any) => {
    updateData('socioDemographic', { [field]: value });
  };

  const calculateBMI = () => {
    if (socioDemographic.height && socioDemographic.weight) {
      const heightInMeters = socioDemographic.height / 100;
      return (socioDemographic.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '0';
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div>
            <Label htmlFor="schoolName" className="text-sm font-medium">School Name</Label>
            <Input
              id="schoolName"
              value={socioDemographic.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="Enter school name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              value={socioDemographic.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="text-sm font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                min="6"
                max="17"
                value={socioDemographic.age || 0}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
              <Select value={socioDemographic.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class" className="text-sm font-medium">Class</Label>
              <Input
                id="class"
                value={socioDemographic.class}
                onChange={(e) => handleChange('class', e.target.value)}
                placeholder="e.g., 10th"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="section" className="text-sm font-medium">Section</Label>
              <Input
                id="section"
                value={socioDemographic.section}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="e.g., A"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={socioDemographic.height || 0}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
                placeholder="e.g., 150"
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={socioDemographic.weight || 0}
                onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                placeholder="e.g., 45"
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          {socioDemographic.height && socioDemographic.weight && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Calculated BMI: <span className="text-lg">{calculateBMI()}</span>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="address" className="text-sm font-medium">Address</Label>
            <Input
              id="address"
              value={socioDemographic.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address"
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hostelResident"
              checked={socioDemographic.hostelResident}
              onCheckedChange={(checked) => handleChange('hostelResident', checked)}
            />
            <Label htmlFor="hostelResident" className="text-sm font-medium">Hostel Resident</Label>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Family Information</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherName" className="text-sm font-medium">Father's Name</Label>
              <Input
                id="fatherName"
                value={socioDemographic.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="Enter father's name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="motherName" className="text-sm font-medium">Mother's Name</Label>
              <Input
                id="motherName"
                value={socioDemographic.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
                placeholder="Enter mother's name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fatherContact" className="text-sm font-medium">Father's Contact</Label>
              <Input
                id="fatherContact"
                value={socioDemographic.fatherContact}
                onChange={(e) => handleChange('fatherContact', e.target.value)}
                placeholder="Enter contact number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="motherContact" className="text-sm font-medium">Mother's Contact</Label>
              <Input
                id="motherContact"
                value={socioDemographic.motherContact}
                onChange={(e) => handleChange('motherContact', e.target.value)}
                placeholder="Enter contact number"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Do you have siblings?</Label>
            <RadioGroup 
              value={socioDemographic.hasSiblings} 
              onValueChange={(value) => handleChange('hasSiblings', value)}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="siblings-yes" />
                <Label htmlFor="siblings-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="siblings-no" />
                <Label htmlFor="siblings-no" className="text-sm">No</Label>
              </div>
            </RadioGroup>

            {socioDemographic.hasSiblings === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="brothers" className="text-sm font-medium">Number of Brothers</Label>
                  <Input
                    id="brothers"
                    type="number"
                    min="0"
                    value={socioDemographic.brothers || 0}
                    onChange={(e) => handleChange('brothers', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sisters" className="text-sm font-medium">Number of Sisters</Label>
                  <Input
                    id="sisters"
                    type="number"
                    min="0"
                    value={socioDemographic.sisters || 0}
                    onChange={(e) => handleChange('sisters', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="birthOrder" className="text-sm font-medium">Birth Order</Label>
                  <Input
                    id="birthOrder"
                    type="number"
                    min="1"
                    value={socioDemographic.birthOrder || 1}
                    onChange={(e) => handleChange('birthOrder', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="familyType" className="text-sm font-medium">Family Type</Label>
            <Select value={socioDemographic.familyType} onValueChange={(value) => handleChange('familyType', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuclear">Nuclear Family</SelectItem>
                <SelectItem value="joint">Joint Family</SelectItem>
                <SelectItem value="three-generation">Three Generation Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Family Health History */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Family Health History</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Please answer the following questions about your family health history</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-6">
          {/* Q1: Does anybody in the family look fat? */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Does anybody in the family look fat?</Label>
            <RadioGroup 
              value={socioDemographic.familyObesity} 
              onValueChange={(value) => handleChange('familyObesity', value)}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="obesity-yes" />
                <Label htmlFor="obesity-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="obesity-no" />
                <Label htmlFor="obesity-no" className="text-sm">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cannot-tell" id="obesity-cannot-tell" />
                <Label htmlFor="obesity-cannot-tell" className="text-sm">Cannot tell</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyObesity === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyObesityRelation} 
                  onValueChange={(value) => handleChange('familyObesityRelation', value)}
                  className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="obesity-father" />
                    <Label htmlFor="obesity-father" className="text-sm">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="obesity-mother" />
                    <Label htmlFor="obesity-mother" className="text-sm">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="obesity-both" />
                    <Label htmlFor="obesity-both" className="text-sm">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q2: Is anyone in the family suffering from diabetes? */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Is anyone in the family suffering from diabetes?</Label>
            <RadioGroup 
              value={socioDemographic.familyDiabetes} 
              onValueChange={(value) => handleChange('familyDiabetes', value)}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="diabetes-yes" />
                <Label htmlFor="diabetes-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diabetes-no" />
                <Label htmlFor="diabetes-no" className="text-sm">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="diabetes-dont-know" />
                <Label htmlFor="diabetes-dont-know" className="text-sm">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyDiabetes === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyDiabetesRelation} 
                  onValueChange={(value) => handleChange('familyDiabetesRelation', value)}
                  className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="diabetes-father" />
                    <Label htmlFor="diabetes-father" className="text-sm">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="diabetes-mother" />
                    <Label htmlFor="diabetes-mother" className="text-sm">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="diabetes-both" />
                    <Label htmlFor="diabetes-both" className="text-sm">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q3: Is anyone in the family suffering from Hypertension? */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Is anyone in the family suffering from Hypertension or taking medicines for High BP?</Label>
            <RadioGroup 
              value={socioDemographic.familyHypertension} 
              onValueChange={(value) => handleChange('familyHypertension', value)}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hypertension-yes" />
                <Label htmlFor="hypertension-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hypertension-no" />
                <Label htmlFor="hypertension-no" className="text-sm">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="hypertension-dont-know" />
                <Label htmlFor="hypertension-dont-know" className="text-sm">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyHypertension === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyHypertensionRelation} 
                  onValueChange={(value) => handleChange('familyHypertensionRelation', value)}
                  className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="hypertension-father" />
                    <Label htmlFor="hypertension-father" className="text-sm">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="hypertension-mother" />
                    <Label htmlFor="hypertension-mother" className="text-sm">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="hypertension-both" />
                    <Label htmlFor="hypertension-both" className="text-sm">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q4: Is anybody in the family suffering from thyroid dysfunction? */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Is anybody in the family suffering from thyroid dysfunction?</Label>
            <RadioGroup 
              value={socioDemographic.familyThyroid} 
              onValueChange={(value) => handleChange('familyThyroid', value)}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="thyroid-yes" />
                <Label htmlFor="thyroid-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="thyroid-no" />
                <Label htmlFor="thyroid-no" className="text-sm">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="thyroid-dont-know" />
                <Label htmlFor="dont-know" className="text-sm">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyThyroid === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyThyroidRelation} 
                  onValueChange={(value) => handleChange('familyThyroidRelation', value)}
                  className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="thyroid-father" />
                    <Label htmlFor="thyroid-father" className="text-sm">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="thyroid-mother" />
                    <Label htmlFor="thyroid-mother" className="text-sm">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="thyroid-both" />
                    <Label htmlFor="thyroid-both" className="text-sm">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocioDemographicStep;
