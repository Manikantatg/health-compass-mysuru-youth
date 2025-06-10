import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedPediaPredict');
    if (hasVisited) {
      navigate('/dashboard', { replace: true });
      return;
    }

    sessionStorage.setItem('hasVisitedPediaPredict', 'true');

    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleError = () => {
    setError('Failed to load animation');
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleDoutlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://doutly.com', '_blank');
  };

  return (
    <div style={styles.container}>
      {isLoading && (
        <div style={styles.loadingContainer}>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
        </div>
      )}
      
      {error ? (
        <div style={styles.errorContainer}>
          <div style={styles.appName}>PediaPredict AI</div>
        </div>
      ) : (
        <>
          <div style={styles.appName}>PediaPredict AI</div>
          <DotLottieReact
            src="https://lottie.host/7a51a990-cd4f-4aca-9dc5-c7ff7f90dd55/SqvTgsCzdi.lottie"
            autoplay
            loop={false}
            style={styles.animation}
            onError={handleError}
            onLoad={handleLoad}
          />
          <a 
            href="https://doutly.com" 
            onClick={handleDoutlyClick}
            style={styles.doutlyLink}
          >
            Powered by Doutly
          </a>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  appName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#3F51B5',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '2rem',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  animation: {
    width: '300px',
    height: '300px',
  },
  doutlyLink: {
    marginTop: '1rem',
    fontSize: '14px',
    color: '#666',
    textDecoration: 'none',
    fontFamily: 'Poppins, sans-serif',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#3F51B5',
    },
  },
} as const;

export default Splash; 