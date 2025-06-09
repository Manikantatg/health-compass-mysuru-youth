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
  onDesiredChange,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label 
              htmlFor="currentBodyImage" 
              className="text-base font-medium"
              aria-label="Current body image perception"
            >
              Current Body Image
            </Label>
            <Input
              id="currentBodyImage"
              type="number"
              min="1"
              max="9"
              value={currentBodyImage}
              onChange={(e) => onCurrentChange(parseInt(e.target.value) || 1)}
              className="w-20"
              placeholder="1-9"
              aria-label="Enter current body image number (1-9)"
              role="spinbutton"
              aria-valuemin={1}
              aria-valuemax={9}
              aria-valuenow={currentBodyImage}
            />
          </div>

          <div className="space-y-4">
            <Label 
              htmlFor="desiredBodyImage" 
              className="text-base font-medium"
              aria-label="Desired body image perception"
            >
              Desired Body Image
            </Label>
            <Input
              id="desiredBodyImage"
              type="number"
              min="1"
              max="9"
              value={desiredBodyImage}
              onChange={(e) => onDesiredChange(parseInt(e.target.value) || 1)}
              className="w-20"
              placeholder="1-9"
              aria-label="Enter desired body image number (1-9)"
              role="spinbutton"
              aria-valuemin={1}
              aria-valuemax={9}
              aria-valuenow={desiredBodyImage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyImageSection;
