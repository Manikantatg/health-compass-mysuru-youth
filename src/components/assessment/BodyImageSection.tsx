
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
    <div className="w-full space-y-6">
      {/* Main Layout with Body Image Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Section - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              How do you currently perceive your body image? (1-9)
            </Label>
            <Input
              type="number"
              min="1"
              max="9"
              value={currentBodyImage || ''}
              onChange={(e) => onCurrentChange(parseInt(e.target.value) || 1)}
              className="w-full focus-ring"
              placeholder="Enter number 1-9"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              How would you ideally like to perceive your body image? (1-9)
            </Label>
            <Input
              type="number"
              min="1"
              max="9"
              value={desiredBodyImage || ''}
              onChange={(e) => onDesiredChange(parseInt(e.target.value) || 1)}
              className="w-full focus-ring"
              placeholder="Enter number 1-9"
            />
          </div>
        </div>

        {/* Body Image Reference Chart - Right Column */}
        <div className="lg:col-span-1">
          <Card className="card-premium h-full">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <h4 className="text-md font-semibold text-foreground mb-2">Body Image Scale</h4>
                  <p className="text-xs text-muted-foreground">
                    Reference guide for perception ratings
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="text-md font-bold text-green-700 dark:text-green-400">1-3</div>
                    <div className="text-xs text-green-600 dark:text-green-500">Thin</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="text-md font-bold text-yellow-700 dark:text-yellow-400">4-6</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-500">Average</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="text-md font-bold text-red-700 dark:text-red-400">7-9</div>
                    <div className="text-xs text-red-600 dark:text-red-500">Heavy</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions Card - Full Width */}
      <Card className="card-premium">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Instructions:</strong> Select the number that best represents how you see yourself currently, 
            and then select how you would ideally like to see yourself.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyImageSection;
