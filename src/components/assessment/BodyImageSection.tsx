
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
      {/* Questions Section */}
      <div className="space-y-6">
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

      {/* Body Image Reference Chart */}
      <Card className="card-premium w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Body Image Reference Scale</h3>
              <p className="text-sm text-muted-foreground">
                Use this scale to help determine your body image perception
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="text-lg font-bold text-green-700 dark:text-green-400">1-3</div>
                <div className="text-sm text-green-600 dark:text-green-500">Thin</div>
                <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                  Below average body size
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">4-6</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-500">Average</div>
                <div className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                  Normal body size range
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="text-lg font-bold text-red-700 dark:text-red-400">7-9</div>
                <div className="text-sm text-red-600 dark:text-red-500">Heavy</div>
                <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Above average body size
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-surface rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Instructions:</strong> Select the number that best represents how you see yourself currently, 
                and then select how you would ideally like to see yourself.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyImageSection;
