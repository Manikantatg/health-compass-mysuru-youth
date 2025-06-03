
# HealthPredict - AI-Powered Health Assessment Platform

A comprehensive health risk assessment platform designed specifically for children and adolescents in Mysuru and Chamarajanagar districts. This platform uses advanced AI technology to predict and analyze health risks, providing personalized recommendations for better health outcomes.

## 🚀 Features

### Core Functionality
- **AI-Powered Analysis**: Advanced machine learning algorithms for accurate health risk predictions
- **Comprehensive Assessment**: Multi-dimensional evaluation covering lifestyle, nutrition, and mental health
- **Personalized Insights**: Tailored recommendations based on individual health profiles
- **Privacy Protected**: Enterprise-grade security for data protection
- **Evidence-Based**: Built on scientific research for children and adolescents
- **Regional Focus**: Specifically designed for Karnataka youth population

### Latest Updates (v2.0)

#### 🎨 Premium UI/UX Redesign
- **60:30:10 Color Strategy**: Soft White (60%), Mint/Teal (30%), Indigo Blue (10%)
- **Typography**: Inter font family for clean, modern aesthetics
- **Responsive Design**: Mobile-first approach with smooth animations
- **Apple-Inspired Interface**: Clean cards, subtle shadows, premium feel

#### 🖼️ Enhanced Authentication
- **Split-Screen Layout**: Form on left, branded illustration on right
- **Mobile Responsive**: Stacked view for mobile devices
- **Trust Indicators**: Feature highlights and testimonials integration
- **Smooth Animations**: Framer Motion powered transitions

#### 📊 Advanced Data Management
- **Dedicated Data Page**: All student cards moved to `/data` route
- **Advanced Filtering**: Risk level, school, gender, assessment date filters
- **Grid/List Views**: Toggle between different card layouts
- **Real-time Search**: Instant filtering and search capabilities

#### 📄 Professional PDF Reports
- **Medical-Grade Reports**: Human-readable health reports in English
- **Professional Formatting**: Includes student info, BMI analysis, health metrics
- **Visual Elements**: Health icons for diet, activity, mental health sections
- **Branding & Security**: Watermarks, timestamps, page numbers
- **Clean Naming**: `healthreport_[studentname]_[date].pdf` format

#### 🧭 Role-Based Navigation
- **Student Dashboard**: Simplified navigation (Dashboard, Assessments only)
- **Admin Dashboard**: Full access (Dashboard, Data, Assessments, Reports, Admin)
- **Smart Routing**: Automatic redirection based on user permissions
- **Mobile Optimized**: Collapsible navigation for mobile devices

#### 🏠 Streamlined Landing Page
- **Fixed Visual Bugs**: Removed white overlay issues affecting hero content
- **Removed Sections**: Testimonials ("What People Say") and FAQ ("Got Questions?")
- **Added "Why It Matters"**: Health impact statistics and infographics
- **Trust Building**: School and clinic focused messaging
- **Performance Optimized**: Faster loading with reduced content

## 👨‍💻 Developer

Developed by **T.G.Manikanta** - A passionate developer focused on creating impactful healthcare solutions for Doutly Technologies.

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS with 60:30:10 color methodology
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Firebase Auth with custom user profiles
- **Styling**: Modern UI components with shadcn/ui
- **Icons**: Lucide Icons with health-focused iconography
- **Routing**: React Router with role-based access control
- **PDF Generation**: jsPDF for professional health reports
- **Animations**: Framer Motion for smooth transitions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn or bun
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/health-predict.git
   cd health-predict
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   # or
   bun run build
   ```

## 📁 Project Structure

```
health-predict/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   ├── assessment/      # Assessment form components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   └── ui/             # Base UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions (PDF export, etc.)
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── public/                # Static assets
└── ...config files
```

## 🎨 Design System

### Color Palette (60:30:10 Method)
- **Primary (60%)**: `#FAFAFA` (Soft White)
- **Secondary (30%)**: `#D0EBE4` (Gentle Teal)
- **Accent (10%)**: `#3F51B5` (Rich Indigo Blue)

### Functional Colors
- **Low Risk**: `#66BB6A` (Green)
- **Medium Risk**: `#FFA000` (Amber)
- **High Risk**: `#EF5350` (Red)
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Info**: `#06B6D4`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600 weight, tight tracking
- **Body**: 400 weight, relaxed line height
- **UI Elements**: 500 weight, medium tracking

## 🔒 Security & Privacy

- **Data Encryption**: All user data encrypted in transit and at rest
- **Role-Based Access**: Separate permissions for students and administrators
- **Privacy Compliant**: GDPR and local privacy law compliance
- **Secure Authentication**: Firebase Auth with proper session management
- **Data Anonymization**: Personal data protected in exports and reports

## 🎯 User Roles

### Student Role
- Complete health assessments
- View personal dashboard with health metrics
- Access personalized recommendations
- Download individual health reports

### Admin Role
- View all student data and analytics
- Export comprehensive reports
- Manage student records (CRUD operations)
- Access advanced filtering and search
- Generate school-wide health insights

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet viewing
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: 44px minimum touch targets
- **Keyboard Navigation**: Full keyboard accessibility

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Developed by**: Doutly Technologies
- **Lead Developer**: T.G.Manikanta
- **Special Thanks**: Healthcare professionals who provided medical insights
- **Community**: Open-source contributors and the React/TypeScript community

## 📈 Roadmap

- [ ] Multi-language support (Kannada, Hindi)
- [ ] Advanced analytics dashboard
- [ ] Integration with school management systems
- [ ] Offline assessment capability
- [ ] Parent/guardian portal
- [ ] Telemedicine consultation integration

## 📞 Support

For support, email support@doutly.com or create an issue in the repository.

For technical documentation, visit our [developer docs](https://docs.healthpredict.in).

---

**Made with ❤️ by T.G.Manikanta for Doutly Technologies**

*Empowering healthier futures for Karnataka's students through AI-powered insights.*
