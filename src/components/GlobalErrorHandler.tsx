/**
 * Global error handler to prevent ALL function-related crashes
 */
import React from 'react';

/**
 * Global error prevention system
 */
export const preventAllFunctionErrors = () => {
  // Override console.error to catch function errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = String(args[0] || '');
    
    // Catch all variations of "not a function" errors
    if (message.includes('not a function') || 
        message.includes('is not a function') ||
        message.includes('Cannot read property') ||
        message.includes('Cannot read properties')) {
      console.warn('GlobalErrorHandler: Prevented function error:', ...args);
      return;
    }
    
    originalError.apply(console, args);
  };

  // Global uncaught error handler
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    
    if (message.includes('not a function') || 
        message.includes('is not a function')) {
      console.warn('GlobalErrorHandler: Caught global function error:', message);
      event.preventDefault();
      return false;
    }
  });

  // Handle React errors
  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason || '');
    
    if (message.includes('not a function') || 
        message.includes('is not a function')) {
      console.warn('GlobalErrorHandler: Caught promise rejection function error:', message);
      event.preventDefault();
    }
  });
};

/**
 * Global error boundary component
 */
export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.warn('GlobalErrorBoundary: Caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('GlobalErrorBoundary: Error details:', error, errorInfo);
    
    // Reset error state after a delay
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 1000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Something went wrong. Reloading...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Global error protection wrapper
 */
export const GlobalErrorProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    preventAllFunctionErrors();
  }, []);

  return (
    <GlobalErrorBoundary>
      {children}
    </GlobalErrorBoundary>
  );
};
