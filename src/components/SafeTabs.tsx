/**
 * Safe Tabs wrapper component that prevents onValueChange errors
 */
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface SafeTabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Safe wrapper for Tabs component with error protection
 */
export function SafeTabs({ value, onValueChange, children, className }: SafeTabsProps) {
  const safeOnValueChange = React.useCallback((newValue: string) => {
    try {
      // Check if onValueChange exists and is a function
      if (onValueChange === null || onValueChange === undefined) {
        console.warn('SafeTabs: onValueChange is null or undefined');
        return;
      }
      
      if (typeof onValueChange !== 'function') {
        console.warn('SafeTabs: onValueChange is not a function', typeof onValueChange, onValueChange);
        return;
      }

      // Validate the new value
      if (typeof newValue !== 'string') {
        console.warn('SafeTabs: Invalid tab value', newValue);
        return;
      }
      
      onValueChange(newValue);
    } catch (error) {
      console.error('SafeTabs: Value change failed', error);
      // Show user-friendly error
      if (typeof alert !== 'undefined') {
        alert('Tab navigation failed. Please try again.');
      }
    }
  }, [onValueChange]);

  return (
    <Tabs 
      value={value || 'overview'} 
      onValueChange={safeOnValueChange}
      className={className}
    >
      {children}
    </Tabs>
  );
}

interface SafeTabsListProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Safe TabsList component
 */
export function SafeTabsList({ children, className }: SafeTabsListProps) {
  return (
    <TabsList className={className}>
      {children}
    </TabsList>
  );
}

interface SafeTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Safe TabsTrigger component
 */
export function SafeTabsTrigger({ value, children, className, disabled }: SafeTabsTriggerProps) {
  return (
    <TabsTrigger 
      value={value} 
      className={className}
      disabled={disabled}
    >
      {children}
    </TabsTrigger>
  );
}

interface SafeTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Safe TabsContent component
 */
export function SafeTabsContent({ value, children, className }: SafeTabsContentProps) {
  return (
    <TabsContent value={value} className={className}>
      {children}
    </TabsContent>
  );
}
