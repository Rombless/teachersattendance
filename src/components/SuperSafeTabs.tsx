/**
 * Super safe tabs implementation that completely prevents onTabChange errors
 */
import React from 'react';
import { cn } from '../lib/utils';

interface SuperSafeTabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SuperSafeTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface SuperSafeTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface SuperSafeTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Context for tab state management
 */
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {}
});

/**
 * Super safe tabs wrapper that never throws function errors
 */
export function SuperSafeTabs({ value, onValueChange, children, className }: SuperSafeTabsProps) {
  const safeOnValueChange = React.useCallback((newValue: string) => {
    try {
      // Multiple layers of safety
      if (!onValueChange) {
        console.warn('SuperSafeTabs: No onValueChange handler provided');
        return;
      }
      
      if (typeof onValueChange !== 'function') {
        console.error('SuperSafeTabs: onValueChange is not a function', onValueChange);
        return;
      }
      
      if (!newValue || typeof newValue !== 'string') {
        console.warn('SuperSafeTabs: Invalid value', newValue);
        return;
      }
      
      onValueChange(newValue);
    } catch (error) {
      console.error('SuperSafeTabs: Handler execution failed', error);
    }
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value: value || '', onValueChange: safeOnValueChange }}>
      <div className={cn('space-y-4', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Super safe tabs list
 */
export function SuperSafeTabsList({ children, className }: SuperSafeTabsListProps) {
  return (
    <div className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Super safe tabs trigger
 */
export function SuperSafeTabsTrigger({ value, children, className, disabled }: SuperSafeTabsTriggerProps) {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);
  
  const handleClick = React.useCallback(() => {
    try {
      if (disabled) return;
      
      if (!value || typeof value !== 'string') {
        console.warn('SuperSafeTabsTrigger: Invalid value', value);
        return;
      }
      
      if (typeof onValueChange !== 'function') {
        console.error('SuperSafeTabsTrigger: onValueChange not available');
        return;
      }
      
      onValueChange(value);
    } catch (error) {
      console.error('SuperSafeTabsTrigger: Click failed', error);
    }
  }, [value, onValueChange, disabled]);

  const isActive = currentValue === value;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-background text-foreground shadow',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

/**
 * Super safe tabs content
 */
export function SuperSafeTabsContent({ value, children, className }: SuperSafeTabsContentProps) {
  const { value: currentValue } = React.useContext(TabsContext);
  
  if (currentValue !== value) {
    return null;
  }

  return (
    <div className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}>
      {children}
    </div>
  );
}
