/**
 * Safe component wrappers to prevent crashes
 */
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { Select, SelectProps } from './ui/select';

/**
 * Safe Button component with error handling
 */
export function SafeButton({ onClick, children, ...props }: ButtonProps) {
  const safeOnClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (onClick && typeof onClick === 'function') {
        onClick(e);
      }
    } catch (error) {
      console.error('SafeButton: Error in onClick:', error);
    }
  }, [onClick]);

  return (
    <Button {...props} onClick={safeOnClick}>
      {children}
    </Button>
  );
}

/**
 * Safe Select component with error handling
 */
interface SafeSelectProps extends SelectProps {
  children: React.ReactNode;
}

export function SafeSelect({ children, onValueChange, ...props }: SafeSelectProps) {
  const safeOnValueChange = React.useCallback((value: string) => {
    try {
      if (onValueChange && typeof onValueChange === 'function') {
        onValueChange(value);
      }
    } catch (error) {
      console.error('SafeSelect: Error in onValueChange:', error);
    }
  }, [onValueChange]);

  return (
    <Select {...props} onValueChange={safeOnValueChange}>
      {children}
    </Select>
  );
}
