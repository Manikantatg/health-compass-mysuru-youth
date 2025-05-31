
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Settings, Menu, X, Bell, Search } from 'lucide-react';
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
    { icon: Activity, label: 'Dashboard', path: '/dashboard', description: 'Patient overview and analytics' }
  ];

  if (userProfile?.role === 'admin') {
    navItems.push(
      { icon: User, label: 'Profile', path: '/profile', description: 'Personal settings and preferences' },
      { icon: Settings, label: 'Admin', path: '/admin', description: 'System administration tools' }
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Medical Navigation Header */}
      <nav className="glass-medical border-b sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Medical Logo */}
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 bg-medical-blue rounded-xl flex items-center justify-center shadow-sm">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold text-medical-blue font-satoshi tracking-tight">
                    HealthPredict
                  </h1>
                  <span className="text-xs text-muted-foreground font-medium">Clinical Platform</span>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`${
                      location.pathname === item.path
                        ? 'text-medical-blue bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    } medical-nav-link tab-medical font-satoshi tracking-tight group relative`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={item.description}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex tap-target rounded-xl text-muted-foreground hover:text-foreground"
                title="Search patients and records"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex tap-target rounded-xl text-muted-foreground hover:text-foreground relative"
                title="Notifications and alerts"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-coral-red rounded-full animate-pulse"></span>
              </Button>
              
              {/* User Profile */}
              <div className="hidden md:flex items-center space-x-3 pl-3 border-l">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium text-foreground">
                    {currentUser?.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {userProfile?.role || 'User'}
                  </span>
                </div>
                <div className="w-8 h-8 bg-sage-green rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              </div>
              
              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="hidden md:flex items-center btn-medical-ghost text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden tap-target rounded-xl"
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
              className="md:hidden glass-medical border-t"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-medical-blue'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } w-full flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 font-satoshi tracking-tight tap-target`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <div className="flex flex-col items-start">
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {item.description}
                      </span>
                    </div>
                  </motion.button>
                ))}
                
                <div className="pt-3 border-t">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full flex items-center justify-start px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl tap-target"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="animate-fade-in-smooth"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
