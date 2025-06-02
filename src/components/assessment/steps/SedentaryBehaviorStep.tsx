import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SedentaryBehavior } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SedentaryBehaviorStep: React.FC<Props> = ({ data, updateData }) => {
  const sedentaryBehavior = data.sedentaryBehavior as SedentaryBehavior;

  const handleChange = (field: keyof SedentaryBehavior, value: number) => {
    updateData('sedentaryBehavior', { [field]: value });
  };

  const timeOptions = [
    { value: 0, label: '0-1 hrs' },
    { value: 1, label: '2-3 hrs' },
    { value: 2, label: '3+ hrs' }
  ];

  const ActivityRadioGroup = ({ field, label }: { field: keyof SedentaryBehavior; label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={sedentaryBehavior[field]?.toString() || "0"}
        onValueChange={(value) => handleChange(field, parseInt(value))}
        className="flex space-x-6"
      >
        {timeOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value.toString()} id={`${String(field)}-${option.value}`} />
            <Label htmlFor={`${String(field)}-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const screenTimeActivities = [
    { key: 'tvTime', label: 'Watching TV/Movies' },
    { key: 'mobileTime', label: 'Mobile/Tablet' }
  ];

  const readingActivities = [
    { key: 'schoolReading', label: 'Reading – School Related' },
    { key: 'nonSchoolReading', label: 'Reading – Non-School Related' }
  ];

  const otherActivities = [
    { key: 'indoorGamesTime', label: 'Indoor Games' },
    { key: 'outdoorGamesTime', label: 'Outdoor Games' },
    { key: 'tuitionTime', label: 'Tuition Classes' }
  ];

  const calculateTotalScreenTime = () => {
    return (sedentaryBehavior.tvTime || 0) + (sedentaryBehavior.mobileTime || 0);
  };

  const calculateTotalSedentaryTime = () => {
    return Object.values(sedentaryBehavior).reduce((sum, value) => sum + (value || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Step 4: Screen Time & Sedentary Behavior</h3>
        <p className="text-gray-600">Track your screen-based and sedentary activities (Last 7 Days)</p>
      </div>

      {/* Screen-Based Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Screen-Based Activities (Last 7 Days)</CardTitle>
          <CardDescription>How much time do you spend on these activities daily?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Activity Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Time Spent (Select One)</th>
                </tr>
              </thead>
              <tbody>
                {screenTimeActivities.map((activity) => (
                  <tr key={activity.key} className="border-b">
                    <td className="py-4 px-4 text-sm font-medium">{activity.label}</td>
                    <td className="py-4 px-4">
                      <RadioGroup
                        value={sedentaryBehavior[activity.key as keyof SedentaryBehavior]?.toString() || "0"}
                        onValueChange={(value) => handleChange(activity.key as keyof SedentaryBehavior, parseInt(value))}
                        className="flex space-x-4"
                      >
                        {timeOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`${activity.key}-${option.value}`} />
                            <Label htmlFor={`${activity.key}-${option.value}`} className="text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reading Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reading & Writing Activities</CardTitle>
          <CardDescription>Time spent on reading and writing activities per day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Activity Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Time Spent (Select One)</th>
                </tr>
              </thead>
              <tbody>
                {readingActivities.map((activity) => (
                  <tr key={activity.key} className="border-b">
                    <td className="py-4 px-4 text-sm font-medium">{activity.label}</td>
                    <td className="py-4 px-4">
                      <RadioGroup
                        value={sedentaryBehavior[activity.key as keyof SedentaryBehavior]?.toString() || "0"}
                        onValueChange={(value) => handleChange(activity.key as keyof SedentaryBehavior, parseInt(value))}
                        className="flex space-x-4"
                      >
                        {timeOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`${activity.key}-${option.value}`} />
                            <Label htmlFor={`${activity.key}-${option.value}`} className="text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Other Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Sedentary Activities</CardTitle>
          <CardDescription>Time spent on games and other activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Activity Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Time Spent (Select One)</th>
                </tr>
              </thead>
              <tbody>
                {otherActivities.map((activity) => (
                  <tr key={activity.key} className="border-b">
                    <td className="py-4 px-4 text-sm font-medium">{activity.label}</td>
                    <td className="py-4 px-4">
                      <RadioGroup
                        value={sedentaryBehavior[activity.key as keyof SedentaryBehavior]?.toString() || "0"}
                        onValueChange={(value) => handleChange(activity.key as keyof SedentaryBehavior, parseInt(value))}
                        className="flex space-x-4"
                      >
                        {timeOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`${activity.key}-${option.value}`} />
                            <Label htmlFor={`${activity.key}-${option.value}`} className="text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`${calculateTotalScreenTime() >= 4 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${calculateTotalScreenTime() >= 4 ? 'text-red-900' : 'text-orange-900'}`}>
              Daily Screen Time (Computed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Screen Time:</span>
                <span className="font-bold">{timeOptions[Math.min(calculateTotalScreenTime(), 2)]?.label || '3+ hrs'}</span>
              </div>
              <div className={`text-xs ${calculateTotalScreenTime() >= 4 ? 'text-red-600' : 'text-orange-600'}`}>
                {calculateTotalScreenTime() >= 4 ? '⚠️ 4+ hrs is NOT recommended' : 'Recommended: Less than 2 hours for recreational screen time'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Total Sedentary Time (Computed)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Total:</span>
                <span className="font-bold">{timeOptions[Math.min(calculateTotalSedentaryTime(), 2)]?.label || '3+ hrs'}</span>
              </div>
              <div className="text-xs text-blue-600">
                Aim: Break sitting time every 60 minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Recommendations */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-900">Health Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Limit recreational screen time to less than 2 hours per day</li>
            <li>• Take a 5-minute break every hour when studying or using devices</li>
            <li>• Use a standing desk or exercise ball while doing homework</li>
            <li>• Replace some screen time with physical activities or hobbies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SedentaryBehaviorStep;
