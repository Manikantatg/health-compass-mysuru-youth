
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Physical Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
      </div>

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
              <Label htmlFor="brothers">Brothers</Label>
              <Input
                id="brothers"
                type="number"
                min="0"
                value={socioDemographic.brothers}
                onChange={(e) => handleChange('brothers', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="sisters">Sisters</Label>
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
              <Input
                id="birthOrder"
                type="number"
                min="1"
                value={socioDemographic.birthOrder}
                onChange={(e) => handleChange('birthOrder', parseInt(e.target.value) || 1)}
              />
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

          <div className="space-y-3">
            <h4 className="font-medium">Family Health History</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="familyObesityHistory"
                  checked={socioDemographic.familyObesityHistory}
                  onCheckedChange={(checked) => handleChange('familyObesityHistory', checked)}
                />
                <Label htmlFor="familyObesityHistory">Family Obesity History</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="diabetesHistory"
                  checked={socioDemographic.diabetesHistory}
                  onCheckedChange={(checked) => handleChange('diabetesHistory', checked)}
                />
                <Label htmlFor="diabetesHistory">Diabetes History</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="bpHistory"
                  checked={socioDemographic.bpHistory}
                  onCheckedChange={(checked) => handleChange('bpHistory', checked)}
                />
                <Label htmlFor="bpHistory">Blood Pressure History</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="thyroidHistory"
                  checked={socioDemographic.thyroidHistory}
                  onCheckedChange={(checked) => handleChange('thyroidHistory', checked)}
                />
                <Label htmlFor="thyroidHistory">Thyroid History</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocioDemographicStep;
