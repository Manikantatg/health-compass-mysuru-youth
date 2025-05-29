import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, FileText, Settings, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' }
  ];

  if (userProfile?.role === 'admin') {
    navItems.push(
      { icon: FileText, label: 'Assessment', path: '/assessment' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Admin', path: '/admin' }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-10 w-auto"
                  src="/logo.png"
                  alt="HealthPredict"
                />
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`${
                      location.pathname === item.path
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600 border-transparent hover:border-blue-600'
                    } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="hidden md:flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                className="md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    } w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </motion.button>
                ))}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full flex items-center justify-start px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;

