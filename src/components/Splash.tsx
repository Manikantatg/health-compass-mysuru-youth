import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (currentUser) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, currentUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading PediaPredict ...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">PediaPredict </h1>
          <p className="text-muted-foreground">Your Health Assessment Guide</p>
        </div>
      )}
    </div>
  );
};

export default Splash; 