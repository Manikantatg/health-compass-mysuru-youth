# Health Compass Mysuru Youth - College Project Report

## Project Overview
Health Compass Mysuru Youth is a comprehensive health assessment and management platform designed to help students and administrators track, analyze, and improve youth health metrics in Mysuru. The platform leverages modern web technologies and artificial intelligence to provide personalized health insights and recommendations.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS
  - Shadcn UI Components
  - Radix UI Primitives
- **State Management**: 
  - React Query for server state
  - React Context for global state
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Charts & Visualization**: Recharts
- **PDF Generation**: jsPDF

### Backend & Services
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Integration**: Google Generative AI (Gemini)
- **Deployment**: Vercel

## Features

### Student Features
1. **User Authentication**
   - Secure login/signup
   - Profile management
   - Password reset functionality

2. **Health Assessment**
   - Comprehensive health questionnaire
   - Real-time assessment feedback
   - Historical assessment tracking
   - Personalized health recommendations

3. **Dashboard**
   - Health metrics visualization
   - Progress tracking
   - Recent activity feed
   - Quick access to assessments

4. **Data Visualization**
   - Interactive health charts
   - Trend analysis
   - Comparative statistics
   - Export functionality

### Admin Features
1. **User Management**
   - Student profile management
   - Role assignment
   - Access control

2. **Analytics Dashboard**
   - Obesity Risk Level metrics
   - Student performance tracking
   - Statistical analysis
   - Data export capabilities

3. **Assessment Management**
   - Create/edit assessments
   - View assessment results
   - Generate reports
   - Track completion rates

4. **Insights Generation**
   - AI-powered health insights
   - Trend analysis
   - Predictive analytics
   - Custom report generation

## AI Integration

### Google Generative AI (Gemini) Implementation
The platform uses Google's Generative AI to provide intelligent health insights and recommendations. The AI integration is implemented through the following components:

1. **Health Assessment Analysis**
   ```typescript
   // AI prompt for health assessment analysis
   const assessmentPrompt = `
   Analyze the following health assessment data and provide:
   1. Obesity Risk Level status
   2. Key areas of concern
   3. Personalized recommendations
   4. Preventive measures
   `;
   ```

2. **Insight Generation**
   ```typescript
   // AI prompt for generating health insights
   const insightPrompt = `
   Based on the user's health data and history:
   1. Identify patterns and trends
   2. Suggest lifestyle improvements
   3. Provide evidence-based recommendations
   4. Highlight potential health risks
   `;
   ```

## API Integration

### Firebase APIs
1. **Authentication API**
   - User registration
   - Login/logout
   - Password reset
   - Session management

2. **Firestore API**
   - User data storage
   - Assessment results
   - Health metrics
   - Analytics data

### Google Generative AI API
- Health assessment analysis
- Personalized recommendations
- Trend analysis
- Insight generation

## Workflow

### Student Workflow
1. **Registration & Login**
   - Create account
   - Complete profile
   - Set health preferences

2. **Health Assessment**
   - Complete initial assessment
   - Receive AI-generated feedback
   - View personalized recommendations

3. **Regular Usage**
   - Track health metrics
   - Update assessments
   - View progress
   - Export reports

### Admin Workflow
1. **User Management**
   - Monitor student registrations
   - Manage user roles
   - Handle support requests

2. **Assessment Management**
   - Review assessment results
   - Generate reports
   - Track completion rates

3. **Analytics & Insights**
   - View overall metrics
   - Analyze trends
   - Generate insights
   - Export data

## Security Features
1. **Authentication**
   - Secure login system
   - Role-based access control
   - Session management

2. **Data Protection**
   - Encrypted data storage
   - Secure API communication
   - Privacy compliance

3. **Access Control**
   - Admin-only routes
   - Protected API endpoints
   - User permission management

## Future Enhancements
1. **Mobile Application**
   - Native mobile app development
   - Offline functionality
   - Push notifications

2. **Advanced AI Features**
   - Predictive health analytics
   - Personalized health plans
   - Real-time health monitoring

3. **Integration Capabilities**
   - Health device integration
   - Third-party health apps
   - Medical record systems

## Installation & Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start development server:
   ```bash
   npm run dev
   ```

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any queries or support, please contact the development team.
