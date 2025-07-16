import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SedentaryBehavior } from '../../../types/assessment';

interface Props {
  data: any;
  updateData: (step: string, data: any) => void;
}

const SedentaryBehaviorStep: React.FC<Props> = ({ data, updateData }) => {
  const sedentaryBehavior = data.sedentaryBehavior as SedentaryBehavior;

  const handleChange = (field: keyof SedentaryBehavior, value: any) => {
    updateData('sedentaryBehavior', { [field]: value });
  };

  const timeOptions = [
    { value: "none", label: "Select hours" },
    { value: 0, label: 'Never' },
    { value: 1, label: '< 1 hr/ day' },
    { value: 2, label: '1-2 hr/ day' },
    { value: 3, label: '2-3 hr/ day' },
    { value: 4, label: '> 3 hr/ day' }
  ];

  const screenTimeActivities = [
    { key: 'tvTime', label: 'Watching TV/Movies' },
    { key: 'mobileTime', label: 'Mobile/Tablet' }
  ];

  const readingActivities = [
    { key: 'schoolReading', label: 'Reading and writing – school related (Homework, textbook, notes, assignments, projects)' },
    { key: 'nonSchoolReading', label: 'Non-school related – reading/writing (Books, comics, personal articles)' }
  ];

  const otherActivities = [
    { key: 'indoorGamesTime', label: 'Playing indoor games – (Carrom, Pacchi, Ludo, Chess, Snake & Ladder)' },
    { key: 'outdoorGamesTime', label: 'Playing outdoor games – (Antyakshari, Damsharas, Business Games)' },
    { key: 'tuitionTime', label: 'Tuition Classes' }
  ];

  const calculateTotalScreenTime = () => {
    // Ensure values are numbers before summing
    const tvTime = typeof sedentaryBehavior.tvTime === 'number' ? sedentaryBehavior.tvTime : 0;
    const mobileTime = typeof sedentaryBehavior.mobileTime === 'number' ? sedentaryBehavior.mobileTime : 0;
    return tvTime + mobileTime;
  };

  const calculateTotalSedentaryTime = () => {
    // Sum up all time-based sedentary behaviors, ensuring values are numbers
    const relevantFields: (keyof SedentaryBehavior)[] = [
      'tvTime', 'mobileTime', 'schoolReading', 'nonSchoolReading',
      'indoorGamesTime', 'outdoorGamesTime', 'tuitionTime',
    ];
    return relevantFields.reduce((sum, field) => sum + (typeof sedentaryBehavior[field] === 'number' ? (sedentaryBehavior[field] as number) : 0), 0);
  };

  const ActivityDropdown = ({ activityKey, label }: { activityKey: keyof SedentaryBehavior; label: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-b-0">
      <Label htmlFor={`sedentary-${activityKey}`} className="text-sm font-medium mb-2 sm:mb-0 sm:w-1/2">{label}</Label>
      <Select
        id={`sedentary-${activityKey}`}
        name={activityKey}
        autoComplete="off"
        value={sedentaryBehavior[activityKey]?.toString() || "none"}
        onValueChange={(value) => handleChange(activityKey, value === "none" ? undefined : parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select hours" />
        </SelectTrigger>
        <SelectContent>
        {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Sedentary Behaviour Activities (Last 7 Days)</h3>
        <p className="text-muted-foreground text-sm">Track your screen-based and sedentary activities</p>
      </div>

      {/* Screen-Based Activities */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Screen-Based Activities (Last 7 Days)</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">How often do you engage in these activities?</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {screenTimeActivities.map((activity) => (
            <ActivityDropdown
              key={activity.key}
              activityKey={activity.key as keyof SedentaryBehavior}
              label={activity.label}
            />
          ))}
        </CardContent>
      </Card>

      {/* Reading & Writing Activities */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Reading & Writing Activities</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Time spent on reading and writing activities</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {readingActivities.map((activity) => (
            <ActivityDropdown
              key={activity.key}
              activityKey={activity.key as keyof SedentaryBehavior}
              label={activity.label}
            />
          ))}
        </CardContent>
      </Card>

      {/* Other Sedentary Activities */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Other Sedentary Activities</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Time spent on games and other activities</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {otherActivities.map((activity) => (
            <ActivityDropdown
              key={activity.key}
              activityKey={activity.key as keyof SedentaryBehavior}
              label={activity.label}
            />
          ))}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`border ${calculateTotalScreenTime() >= 6 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${calculateTotalScreenTime() >= 6 ? 'text-red-900' : 'text-orange-900'}`}>
              Daily Screen Time (Computed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Screen Time:</span>
                <span className="font-bold">{timeOptions[Math.min(calculateTotalScreenTime(), timeOptions.length - 1)]?.label || '> 3 Hr/day'}</span>
              </div>
              <div className={`text-xs ${calculateTotalScreenTime() >= 6 ? 'text-red-600' : 'text-orange-600'}`}>
                {calculateTotalScreenTime() >= 6 ? '⚠️ > 6 hrs is NOT recommended' : 'Recommended: Less than 2 hours for recreational screen time'}
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
                <span className="font-bold">{timeOptions[Math.min(calculateTotalSedentaryTime(), timeOptions.length - 1)]?.label || '> 3 Hr/day'}</span>
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
