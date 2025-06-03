
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Settings, Menu, X, FileText, BarChart3, Plus, Moon, Sun, Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Assessments', path: '/assessment' },
    { icon: Database, label: 'Data', path: '/data' }
  ];

  if (userProfile?.role === 'admin') {
    navItems.push(
      { icon: BarChart3, label: 'Reports', path: '/admin' },
      { icon: Settings, label: 'Admin', path: '/profile' }
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl bg-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
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
                        ? 'nav-link active'
                        : 'nav-link'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* New Assessment Button */}
              <Button
                onClick={() => navigate('/assessment')}
                className="hidden md:flex btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Button>

              {/* Theme Toggle */}
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="rounded-lg"
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
                className="hidden md:flex items-center text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>

              {/* Mobile Menu */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
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
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    } w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={() => {
                    navigate('/assessment');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  New Assessment
                </motion.button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full flex items-center justify-start px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
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
