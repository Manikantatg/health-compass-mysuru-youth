import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart, Lightbulb, User, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    ...(isAdmin ? [
      { path: '/data', icon: BarChart, label: 'Data' },
      { path: '/insights', icon: Lightbulb, label: 'Insights' },
    ] : []),
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg md:hidden">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
      {/* Floating Action Button for adding new entries */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <Link to="/assessment">
          <Button 
            size="icon" 
            className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <PlusCircle className="h-8 w-8" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavbar; 