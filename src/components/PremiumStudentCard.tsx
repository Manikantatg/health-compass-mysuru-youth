import { AssessmentData } from '@/types/assessment';
import { Card, CardContent, Typography, Box, Chip, List, ListItem, ListItemText, Grid, Divider, LinearProgress, Paper } from '@mui/material';
import { format } from 'date-fns';
import { Warning, CheckCircle, Error, Psychology, TrendingUp } from '@mui/icons-material';

interface PremiumStudentCardProps {
  assessment: AssessmentData;
}

export const PremiumStudentCard = ({ assessment }: PremiumStudentCardProps) => {
  const { student, responses, completedAt, aiPrediction } = assessment;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return <CheckCircle color="success" />;
      case 'Medium':
        return <Warning color="warning" />;
      case 'High':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const formatTime = (time: string) => {
    return time === '00:00' ? 'Not reported' : time;
  };

  const formatActivity = (activity: { days: number; minutes: string }) => {
    return `${activity.days} days, ${activity.minutes} hours`;
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <CardContent>
        {/* Student Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {student.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Age: {student.age} years
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gender: {student.gender}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                School: {student.schoolName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Class: {student.class} {student.section}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Family Type: {student.familyType}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hostel Resident: {student.hostelResident ? 'Yes' : 'No'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Risk Percentage Display */}
        {aiPrediction && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div">
                Obesity Risk Assessment
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Risk Score */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Risk Score
                    </Typography>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold" 
                      color={getRiskColor(aiPrediction.riskLevel)}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {aiPrediction.riskPercentage}%
                      {getRiskIcon(aiPrediction.riskLevel)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={aiPrediction.riskPercentage}
                    color={getRiskColor(aiPrediction.riskLevel)}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    {aiPrediction.riskLevel} Risk Level
                  </Typography>
                </Box>
              </Grid>

              {/* AI Confidence */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      AI Confidence
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {aiPrediction.confidenceScore}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={aiPrediction.confidenceScore}
                    color="primary"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* AI Prediction Details */}
        {aiPrediction && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Assessment Details
            </Typography>
            <Typography variant="body1" paragraph>
              {aiPrediction.explanation}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Key Risk Factors:
                </Typography>
                <List dense>
                  {aiPrediction.keyRiskFactors.map((factor, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={factor} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Recommendations:
                </Typography>
                <List dense>
                  {aiPrediction.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Detailed Assessment Data */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Detailed Assessment Data
          </Typography>

          {/* Physical Activity */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Physical Activity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  PT: {responses.physicalActivity.ptFrequency} times/week, {responses.physicalActivity.ptDuration} mins
                </Typography>
                <Typography variant="body2">
                  Indoor Games: {formatActivity(responses.physicalActivity.indoorGames)}
                </Typography>
                <Typography variant="body2">
                  Outdoor Games: {formatActivity(responses.physicalActivity.outdoorGames)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Yoga: {formatActivity(responses.physicalActivity.yoga)}
                </Typography>
                <Typography variant="body2">
                  Cycling: {formatActivity(responses.physicalActivity.cycling)}
                </Typography>
                <Typography variant="body2">
                  Walking: {formatActivity(responses.physicalActivity.walking)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Eating Habits */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Eating Habits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Fruits: {responses.nutrition.fruits} servings/day
                </Typography>
                <Typography variant="body2">
                  Vegetables: {responses.nutrition.vegetables} servings/day
                </Typography>
                <Typography variant="body2">
                  Cereals: {responses.nutrition.cereals} servings/day
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Junk Food: {responses.nutrition.junkFood} times/week
                </Typography>
                <Typography variant="body2">
                  Soft Drinks: {responses.nutrition.softDrinks} times/week
                </Typography>
                <Typography variant="body2">
                  Energy Drinks: {responses.nutrition.energyDrinks} times/week
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Sleep Quality */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Sleep Quality
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Bedtime: {formatTime(responses.sleep.bedtime)}
                </Typography>
                <Typography variant="body2">
                  Wake-up: {formatTime(responses.sleep.wakeupTime)}
                </Typography>
                <Typography variant="body2">
                  Duration: {responses.sleep.sleepDuration} minutes
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Sleep Quality Score: {responses.sleep.difficultyFallingAsleep}/10
                </Typography>
                <Typography variant="body2">
                  Sleepiness in Class: {responses.sleep.sleepinessInClasses}/10
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Mental Health */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Mental Health
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Body Image Satisfaction: {responses.mentalHealth.currentBodyImageSatisfaction}/10
                </Typography>
                <Typography variant="body2">
                  Weight Goal: {responses.mentalHealth.weightGoal}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Bullying Experience: {responses.mentalHealth.bullyingExperience ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  Emotional Wellbeing: {responses.mentalHealth.feelLonely}/10
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Family History */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Family History
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Obesity: {responses.familyHistory.obesity}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Diabetes: {responses.familyHistory.diabetes}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Hypertension: {responses.familyHistory.hypertension}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary">
            Assessment Date: {format(new Date(completedAt), 'PPP')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 