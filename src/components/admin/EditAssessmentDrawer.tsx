import React, { useState, useEffect } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData, SocioDemographic } from '../../types/assessment';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface EditAssessmentDrawerProps {
  assessment: AssessmentData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAssessment: AssessmentData) => void;
}

const EditAssessmentDrawer: React.FC<EditAssessmentDrawerProps> = ({
  assessment, isOpen, onClose, onUpdate
}) => {
  const [formData, setFormData] = useState<Partial<SocioDemographic>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assessment) {
      setFormData(assessment.socioDemographic || {});
    }
  }, [assessment]);

  const handleChange = (field: keyof SocioDemographic, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment || !assessment.id) return;

    setLoading(true);
    try {
      const assessmentRef = doc(db, 'assessments', assessment.id);
      const updatedAssessment = {
        ...assessment,
        socioDemographic: {
          ...assessment.socioDemographic,
          ...formData,
          age: parseInt(formData.age as string) || 0, // Ensure age is number
          height: parseInt(formData.height as string) || 0, // Ensure height is number
          weight: parseInt(formData.weight as string) || 0, // Ensure weight is number
          brothers: parseInt(formData.brothers as string) || 0,
          sisters: parseInt(formData.sisters as string) || 0,
          birthOrder: parseInt(formData.birthOrder as string) || 1,
        },
        updatedAt: new Date(),
      };

      await updateDoc(assessmentRef, updatedAssessment);
      onUpdate(updatedAssessment);
      toast({
        title: "Success",
        description: "Student assessment updated successfully."
      });
      onClose();
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to update assessment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 h-[90%] md:h-[80%] lg:h-[70%] xl:h-[60%] flex flex-col rounded-t-[10px] z-50 bg-background">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-foreground">Edit Student Assessment</DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Make changes to the student's health assessment here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Student's Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age || 0}
                onChange={(e) => handleChange('age', e.target.value)}
                min="6"
                max="17"
                placeholder="e.g., 12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || 'male'} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={formData.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="e.g., Springdale High"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                name="class"
                value={formData.class || ''}
                onChange={(e) => handleChange('class', e.target.value)}
                placeholder="e.g., 10th"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                name="section"
                value={formData.section || ''}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="e.g., A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height || 0}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="e.g., 150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight || 0}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="e.g., 45"
              />
            </div>

            {/* Family Info */}
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName || ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="Father's Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                name="motherName"
                value={formData.motherName || ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                placeholder="Mother's Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherContact">Father's Contact</Label>
              <Input
                id="fatherContact"
                name="fatherContact"
                type="tel"
                value={formData.fatherContact || ''}
                onChange={(e) => handleChange('fatherContact', e.target.value)}
                placeholder="e.g., +919876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherContact">Mother's Contact</Label>
              <Input
                id="motherContact"
                name="motherContact"
                type="tel"
                value={formData.motherContact || ''}
                onChange={(e) => handleChange('motherContact', e.target.value)}
                placeholder="e.g., +919876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brothers">Number of Brothers</Label>
              <Input
                id="brothers"
                name="brothers"
                type="number"
                value={formData.brothers || 0}
                onChange={(e) => handleChange('brothers', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sisters">Number of Sisters</Label>
              <Input
                id="sisters"
                name="sisters"
                type="number"
                value={formData.sisters || 0}
                onChange={(e) => handleChange('sisters', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthOrder">Birth Order</Label>
              <Select value={formData.birthOrder?.toString() || '1'} onValueChange={(value) => handleChange('birthOrder', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select birth order" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((order) => (
                    <SelectItem key={order} value={order.toString()}>{order}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyType">Family Type</Label>
              <Select value={formData.familyType || 'nuclear'} onValueChange={(value) => handleChange('familyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Family Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuclear">Nuclear</SelectItem>
                  <SelectItem value="joint">Joint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyObesity">Family History of Obesity</Label>
              <Select value={formData.familyObesity || 'no'} onValueChange={(value) => handleChange('familyObesity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyDiabetes">Family History of Diabetes</Label>
              <Select value={formData.familyDiabetes || 'no'} onValueChange={(value) => handleChange('familyDiabetes', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyHypertension">Family History of Hypertension</Label>
              <Select value={formData.familyHypertension || 'no'} onValueChange={(value) => handleChange('familyHypertension', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyThyroid">Family History of Thyroid</Label>
              <Select value={formData.familyThyroid || 'no'} onValueChange={(value) => handleChange('familyThyroid', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full address"
              />
            </div>
          </form>
        </div>
        <DrawerFooter className="flex-col gap-2 p-4 pt-0">
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">
              Cancel
              <X className="ml-2 h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditAssessmentDrawer; 