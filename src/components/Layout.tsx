import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Menu, X, FileText, BarChart3, Plus, Moon, Sun, Database, Lightbulb, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from './layout/BottomNavbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getHeaderTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard';
      case '/assessment': return 'New Assessment';
      case '/data': return 'Student Data';
      case '/insights': return 'Insights';
      case '/profile': return 'Profile';
      case '/admin': return 'Admin Panel';
      default: return 'PediaPredict';
    }
  };

  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      {/* Top Header - Visible on all screens, simplified for mobile */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            <h1 className="text-xl font-semibold text-[#3F51B5] tracking-tight">
              {getHeaderTitle(location.pathname)}
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Navigation (Moved from original Navbar) */}
            <Button
              onClick={() => navigate('/dashboard')}
              className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === '/dashboard' ? 'bg-[#3F51B5] text-white shadow-sm' : 'text-gray-600 hover:text-[#3F51B5] hover:bg-[#D0EBE4]/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Activity className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            {userProfile?.role === 'admin' && (
              <>
                <Button
                  onClick={() => navigate('/data')}
                  className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/data' ? 'bg-[#3F51B5] text-white shadow-sm' : 'text-gray-600 hover:text-[#3F51B5] hover:bg-[#D0EBE4]/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </Button>
                <Button
                  onClick={() => navigate('/insights')}
                  className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/insights' ? 'bg-[#3F51B5] text-white shadow-sm' : 'text-gray-600 hover:text-[#3F51B5] hover:bg-[#D0EBE4]/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Insights
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/profile' ? 'bg-[#3F51B5] text-white shadow-sm' : 'text-gray-600 hover:text-[#3F51B5] hover:bg-[#D0EBE4]/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </>
            )}
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-lg hover:bg-[#D0EBE4]/30"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="items-center text-gray-600 hover:text-[#3F51B5] hover:bg-[#D0EBE4]/30 px-4 py-2 rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation Bar - Mobile Only */}
      <BottomNavbar />
    </div>
  );
};

export default Layout;
