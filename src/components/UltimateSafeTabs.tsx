/**
 * Ultimate safe tabs implementation - completely eliminates onTabChange errors
 */
import React from 'react';
import { cn } from '../lib/utils';

interface UltimateSafeTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface UltimateSafeTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface UltimateSafeTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface UltimateSafeTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Ultimate safe context for tab state management
 */
const UltimateSafeTabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {}
});

/**
 * Ultimate safe tabs wrapper that NEVER throws function errors
 */
export function UltimateSafeTabs({ value = 'overview', onValueChange, children, className }: UltimateSafeTabsProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  
  // Explicitly ensure onValueChange is a function or assign default
  const safeOnValueChange: (value: string) => void = React.useMemo(() => {
    if (typeof onValueChange === 'function') {
      console.log('UltimateSafeTabs: onValueChange is properly assigned as function');
      return onValueChange;
    } else {
      console.warn('UltimateSafeTabs: onValueChange not a function, using default', typeof onValueChange);
      return (value: string) => {
        console.log('UltimateSafeTabs: Default handler called with value:', value);
      };
    }
  }, [onValueChange]);
  
  // Update internal value when prop changes
  React.useEffect(() => {
    if (typeof value === 'string' && value.trim() !== '') {
      setInternalValue(value);
    }
  }, [value]);

  const ultimateSafeHandler: (newValue: string) => void = React.useCallback((newValue: string) => {
    try {
      // Update internal state first
      if (typeof newValue === 'string' && newValue.trim() !== '') {
        setInternalValue(newValue);
      }
      
      // Call the guaranteed function
      console.log('UltimateSafeTabs: Calling safeOnValueChange with:', newValue);
      safeOnValueChange(newValue);
      
    } catch (outerError) {
      console.error('UltimateSafeTabs: Complete handler failure', outerError);
    }
  }, [safeOnValueChange]);

  const contextValue: { value: string; onValueChange: (value: string) => void } = React.useMemo(() => ({
    value: internalValue,
    onValueChange: ultimateSafeHandler
  }), [internalValue, ultimateSafeHandler]);

  // Verify context value has proper function
  React.useEffect(() => {
    if (typeof contextValue.onValueChange !== 'function') {
      console.error('CRITICAL: contextValue.onValueChange is not a function!');
    } else {
      console.log('UltimateSafeTabs: contextValue.onValueChange is properly assigned');
    }
  }, [contextValue]);

  return (
    <UltimateSafeTabsContext.Provider value={contextValue}>
      <div className={cn('space-y-4', className)}>
        {children}
      </div>
    </UltimateSafeTabsContext.Provider>
  );
}

/**
 * Ultimate safe tabs list
 */
export function UltimateSafeTabsList({ children, className }: UltimateSafeTabsListProps) {
  return (
    <div className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Ultimate safe tabs trigger
 */
export function UltimateSafeTabsTrigger({ value, children, className, disabled }: UltimateSafeTabsTriggerProps) {
  const context = React.useContext(UltimateSafeTabsContext);
  
  const handleClick: () => void = React.useCallback(() => {
    try {
      if (disabled) {
        console.log('UltimateSafeTabsTrigger: Click ignored - disabled');
        return;
      }
      
      if (!value || typeof value !== 'string') {
        console.warn('UltimateSafeTabsTrigger: Invalid value', value);
        return;
      }
      
      if (!context) {
        console.error('UltimateSafeTabsTrigger: No context available');
        return;
      }
      
      // Explicitly verify the function exists and is callable
      const onValueChangeHandler: (value: string) => void = context.onValueChange;
      
      if (!onValueChangeHandler) {
        console.error('UltimateSafeTabsTrigger: onValueChange handler is null/undefined');
        return;
      }
      
      if (typeof onValueChangeHandler !== 'function') {
        console.error('UltimateSafeTabsTrigger: onValueChange not a function', typeof onValueChangeHandler);
        return;
      }
      
      console.log('UltimateSafeTabsTrigger: Calling onValueChange with value:', value);
      onValueChangeHandler(value);
      
    } catch (error) {
      console.error('UltimateSafeTabsTrigger: Click completely failed', error);
    }
  }, [value, context, disabled]);

  const isActive = context?.value === value;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1',
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
 * Ultimate safe tabs content
 */
export function UltimateSafeTabsContent({ value, children, className }: UltimateSafeTabsContentProps) {
  const context = React.useContext(UltimateSafeTabsContext);
  
  if (!context || context.value !== value) {
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
