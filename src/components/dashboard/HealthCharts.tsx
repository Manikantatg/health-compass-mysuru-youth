
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AssessmentData } from '../../types/assessment';

interface HealthChartsProps {
  assessmentData: AssessmentData;
}

const HealthCharts: React.FC<HealthChartsProps> = ({ assessmentData }) => {
  const { socioDemographic, eatingHabits, physicalActivity, sedentaryBehavior, sleepQuality } = assessmentData;

  // Family Health History Data
  const familyHealthData = [
    {
      name: 'Obesity',
      value: socioDemographic.familyObesity === 'yes' ? 1 : 0,
      color: '#ef4444'
    },
    {
      name: 'Diabetes',
      value: socioDemographic.familyDiabetes === 'yes' ? 1 : 0,
      color: '#f97316'
    },
    {
      name: 'Hypertension',
      value: socioDemographic.familyHypertension === 'yes' ? 1 : 0,
      color: '#eab308'
    },
    {
      name: 'Thyroid',
      value: socioDemographic.familyThyroid === 'yes' ? 1 : 0,
      color: '#22c55e'
    }
  ].filter(item => item.value > 0);

  // Eating Habits Data
  const eatingData = [
    { category: 'Healthy Foods', cereals: eatingHabits.cereals, pulses: eatingHabits.pulses, vegetables: eatingHabits.vegetables, fruits: eatingHabits.fruits },
    { category: 'Unhealthy Foods', snacks: eatingHabits.snacks, sweets: eatingHabits.sweets, beverages: eatingHabits.beverages }
  ];

  // Physical Activity Radar Data
  const activityData = [
    { activity: 'Yoga', minutes: physicalActivity.yoga },
    { activity: 'Exercise', minutes: physicalActivity.exercise },
    { activity: 'Indoor Games', minutes: physicalActivity.indoorGames },
    { activity: 'Outdoor Games', minutes: physicalActivity.outdoorGames },
    { activity: 'Cycling', minutes: physicalActivity.cycling },
    { activity: 'Walking', minutes: physicalActivity.walking }
  ];

  // Screen Time vs Active Time
  const screenTimeData = [
    { day: 'Mon', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Tue', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Wed', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Thu', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Fri', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Sat', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 },
    { day: 'Sun', screenTime: sedentaryBehavior.tvTime + sedentaryBehavior.mobileTime, activeTime: physicalActivity.outdoorGames / 60 }
  ];

  const chartConfig = {
    screenTime: { label: "Screen Time", color: "#ef4444" },
    activeTime: { label: "Active Time", color: "#22c55e" },
    healthy: { label: "Healthy", color: "#22c55e" },
    unhealthy: { label: "Unhealthy", color: "#ef4444" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Family Health History */}
      {familyHealthData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-red-100 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">Family Health History</CardTitle>
              <CardDescription>Hereditary health conditions in your family</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48">
                <PieChart>
                  <Pie
                    data={familyHealthData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {familyHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Physical Activity Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-green-100 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Physical Activity Level</CardTitle>
            <CardDescription>Weekly activity breakdown (minutes)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <RadarChart data={activityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="activity" />
                <PolarRadiusAxis angle={30} domain={[0, 200]} />
                <Radar
                  name="Minutes"
                  dataKey="minutes"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Screen Time vs Active Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Daily Activity Balance</CardTitle>
            <CardDescription>Screen time vs physical activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={screenTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="screenTime" fill="#ef4444" name="Screen Time (hrs)" />
                <Bar dataKey="activeTime" fill="#22c55e" name="Active Time (hrs)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Eating Habits Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-purple-100 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-purple-800">Eating Habits Overview</CardTitle>
            <CardDescription>Healthy vs unhealthy food consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Healthy Foods</span>
                <div className="flex space-x-1">
                  {[...Array(Math.round((eatingHabits.cereals + eatingHabits.pulses + eatingHabits.vegetables + eatingHabits.fruits) / 4))].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Unhealthy Foods</span>
                <div className="flex space-x-1">
                  {[...Array(Math.round((eatingHabits.snacks + eatingHabits.sweets + eatingHabits.beverages) / 3))].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-red-500 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HealthCharts;
