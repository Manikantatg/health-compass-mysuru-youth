
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  currentBodyImage: number;
  desiredBodyImage: number;
  onCurrentChange: (value: number) => void;
  onDesiredChange: (value: number) => void;
}

const BodyImageSection: React.FC<Props> = ({
  currentBodyImage,
  desiredBodyImage,
  onCurrentChange,
  onDesiredChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Left Column - Questions */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">
            How do you currently perceive your body image? (1-9)
          </Label>
          <Input
            type="number"
            min="1"
            max="9"
            value={currentBodyImage || ''}
            onChange={(e) => onCurrentChange(parseInt(e.target.value) || 1)}
            className="mt-2"
            placeholder="Enter number 1-9"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            How would you ideally like to perceive your body image? (1-9)
          </Label>
          <Input
            type="number"
            min="1"
            max="9"
            value={desiredBodyImage || ''}
            onChange={(e) => onDesiredChange(parseInt(e.target.value) || 1)}
            className="mt-2"
            placeholder="Enter number 1-9"
          />
        </div>
      </div>

      {/* Right Column - Body Image Chart */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">Body Image Reference Chart</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-100 p-2 rounded">1-3: Thin</div>
              <div className="bg-yellow-100 p-2 rounded">4-6: Average</div>
              <div className="bg-red-100 p-2 rounded">7-9: Heavy</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select numbers based on how you see yourself
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyImageSection;
