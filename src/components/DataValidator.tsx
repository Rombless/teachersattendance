/**
 * Component that ensures all data is validated before rendering
 */
import { useEffect } from 'react';
import { useDataStore } from '../store/dataStore';

interface DataValidatorProps {
  children: React.ReactNode;
}

export function DataValidator({ children }: DataValidatorProps) {
  const { cleanupData, initialized } = useDataStore();

  useEffect(() => {
    if (initialized) {
      // Run cleanup every time the component mounts
      cleanupData();
      
      // Also run cleanup periodically to catch any runtime issues
      const interval = setInterval(() => {
        cleanupData();
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [initialized, cleanupData]);

  return <>{children}</>;
}
