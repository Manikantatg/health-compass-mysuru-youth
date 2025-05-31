
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Settings, Menu, X } from 'lucide-react';
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
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Admin', path: '/admin' }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-gray-50 font-inter">
      {/* Navigation */}
      <nav className="glass-morphism border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 gradient-electric rounded-2xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient-electric font-satoshi tracking-tight">
                  HealthPredict
                </h1>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`${
                      location.pathname === item.path
                        ? 'text-electric-blue'
                        : 'text-gray-600 hover:text-electric-blue'
                    } inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 nav-link font-satoshi tracking-tight`}
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
                className="hidden md:flex items-center text-gray-600 hover:text-electric-blue hover:bg-electric-blue/10 transition-all duration-200 button-press font-satoshi tracking-tight"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                className="md:hidden button-press"
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
              className="md:hidden glass-morphism border-t border-white/20"
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
                        ? 'bg-electric-blue/10 text-electric-blue'
                        : 'text-gray-600 hover:bg-gray-50'
                    } w-full flex items-center px-3 py-2 rounded-2xl text-base font-medium transition-all duration-200 font-satoshi tracking-tight`}
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
                  className="w-full flex items-center justify-start px-3 py-2 text-gray-600 hover:bg-gray-50 font-satoshi tracking-tight"
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
