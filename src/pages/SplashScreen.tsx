import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to the main page after animation completes
  const handleAnimationComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <DotLottieReact
        src="/animations/splash.lottie"
        loop={false}
        autoplay
        onComplete={handleAnimationComplete}
        className="w-64 h-64"
      />
    </div>
  );
};

export default SplashScreen; 