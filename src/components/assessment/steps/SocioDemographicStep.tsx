
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={socioDemographic.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="Enter school name"
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={socioDemographic.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="6"
                max="17"
                value={socioDemographic.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={socioDemographic.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={socioDemographic.class}
                onChange={(e) => handleChange('class', e.target.value)}
                placeholder="e.g., 10th"
              />
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={socioDemographic.section}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="e.g., A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={socioDemographic.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
                placeholder="e.g., 150"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={socioDemographic.weight}
                onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                placeholder="e.g., 45"
              />
            </div>
          </div>

          {socioDemographic.height && socioDemographic.weight && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Calculated BMI: <span className="text-lg">{calculateBMI()}</span>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={socioDemographic.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hostelResident"
              checked={socioDemographic.hostelResident}
              onCheckedChange={(checked) => handleChange('hostelResident', checked)}
            />
            <Label htmlFor="hostelResident">Hostel Resident</Label>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Family Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                value={socioDemographic.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="Enter father's name"
              />
            </div>

            <div>
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                value={socioDemographic.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
                placeholder="Enter mother's name"
              />
            </div>

            <div>
              <Label htmlFor="fatherContact">Father's Contact</Label>
              <Input
                id="fatherContact"
                value={socioDemographic.fatherContact}
                onChange={(e) => handleChange('fatherContact', e.target.value)}
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <Label htmlFor="motherContact">Mother's Contact</Label>
              <Input
                id="motherContact"
                value={socioDemographic.motherContact}
                onChange={(e) => handleChange('motherContact', e.target.value)}
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="brothers">Number of Brothers</Label>
              <Input
                id="brothers"
                type="number"
                min="0"
                value={socioDemographic.brothers}
                onChange={(e) => handleChange('brothers', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="sisters">Number of Sisters</Label>
              <Input
                id="sisters"
                type="number"
                min="0"
                value={socioDemographic.sisters}
                onChange={(e) => handleChange('sisters', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="birthOrder">Birth Order</Label>
              <Select value={socioDemographic.birthOrder?.toString()} onValueChange={(value) => handleChange('birthOrder', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Child</SelectItem>
                  <SelectItem value="2">Middle Child</SelectItem>
                  <SelectItem value="999">Last Child</SelectItem>
                  <SelectItem value="0">Only Child</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="familyType">Family Type</Label>
            <Select value={socioDemographic.familyType} onValueChange={(value) => handleChange('familyType', value)}>
              <SelectTrigger>
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

      {/* Family History Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Family Health History</CardTitle>
          <CardDescription>Please answer the following questions about your family health history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Q1: Does anybody in the family look fat? */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Does anybody in the family look fat?</Label>
            <RadioGroup 
              value={socioDemographic.familyObesity} 
              onValueChange={(value) => handleChange('familyObesity', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="obesity-yes" />
                <Label htmlFor="obesity-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="obesity-no" />
                <Label htmlFor="obesity-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cannot-tell" id="obesity-cannot-tell" />
                <Label htmlFor="obesity-cannot-tell">Cannot tell</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyObesity === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyObesityRelation} 
                  onValueChange={(value) => handleChange('familyObesityRelation', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="obesity-father" />
                    <Label htmlFor="obesity-father">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="obesity-mother" />
                    <Label htmlFor="obesity-mother">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="obesity-both" />
                    <Label htmlFor="obesity-both">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q2: Is anyone in the family suffering from diabetes? */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Is anyone in the family suffering from diabetes?</Label>
            <RadioGroup 
              value={socioDemographic.familyDiabetes} 
              onValueChange={(value) => handleChange('familyDiabetes', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="diabetes-yes" />
                <Label htmlFor="diabetes-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diabetes-no" />
                <Label htmlFor="diabetes-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="diabetes-dont-know" />
                <Label htmlFor="diabetes-dont-know">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyDiabetes === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyDiabetesRelation} 
                  onValueChange={(value) => handleChange('familyDiabetesRelation', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="diabetes-father" />
                    <Label htmlFor="diabetes-father">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="diabetes-mother" />
                    <Label htmlFor="diabetes-mother">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="diabetes-both" />
                    <Label htmlFor="diabetes-both">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q3: Is anyone in the family suffering from Hypertension? */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Is anyone in the family suffering from Hypertension or taking medicines for High BP?</Label>
            <RadioGroup 
              value={socioDemographic.familyHypertension} 
              onValueChange={(value) => handleChange('familyHypertension', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hypertension-yes" />
                <Label htmlFor="hypertension-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hypertension-no" />
                <Label htmlFor="hypertension-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="hypertension-dont-know" />
                <Label htmlFor="hypertension-dont-know">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyHypertension === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyHypertensionRelation} 
                  onValueChange={(value) => handleChange('familyHypertensionRelation', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="hypertension-father" />
                    <Label htmlFor="hypertension-father">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="hypertension-mother" />
                    <Label htmlFor="hypertension-mother">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="hypertension-both" />
                    <Label htmlFor="hypertension-both">Both Parents</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Q4: Is anybody in the family suffering from thyroid dysfunction? */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Is anybody in the family suffering from thyroid dysfunction?</Label>
            <RadioGroup 
              value={socioDemographic.familyThyroid} 
              onValueChange={(value) => handleChange('familyThyroid', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="thyroid-yes" />
                <Label htmlFor="thyroid-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="thyroid-no" />
                <Label htmlFor="thyroid-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont-know" id="thyroid-dont-know" />
                <Label htmlFor="thyroid-dont-know">Don't know</Label>
              </div>
            </RadioGroup>
            
            {socioDemographic.familyThyroid === 'yes' && (
              <div className="ml-4 space-y-2">
                <Label className="text-sm font-medium">How is he/she related to you?</Label>
                <RadioGroup 
                  value={socioDemographic.familyThyroidRelation} 
                  onValueChange={(value) => handleChange('familyThyroidRelation', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="father" id="thyroid-father" />
                    <Label htmlFor="thyroid-father">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mother" id="thyroid-mother" />
                    <Label htmlFor="thyroid-mother">Mother</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both-parents" id="thyroid-both" />
                    <Label htmlFor="thyroid-both">Both Parents</Label>
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
