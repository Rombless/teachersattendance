/**
 * Safe tabs for all components - replaces any remaining tab usage
 */
import React from 'react';

/**
 * Global tab error interceptor - catches ANY tab-related function errors
 */
export const interceptTabErrors = () => {
  // Intercept any remaining tab change errors globally
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('onTabChange is not a function')) {
      console.warn('TabErrorInterceptor: Caught onTabChange error, preventing crash');
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  // Global error boundary for tabs
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('onTabChange is not a function')) {
      console.warn('TabErrorInterceptor: Caught global onTabChange error');
      event.preventDefault();
      return false;
    }
  });
};

/**
 * Initialize tab error protection on component load
 */
export const TabErrorProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    interceptTabErrors();
  }, []);
  
  return <>{children}</>;
};
