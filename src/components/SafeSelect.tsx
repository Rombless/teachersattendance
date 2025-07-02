/**
 * Safe Select component wrapper
 */
import React from 'react';
import { Select, SelectProps } from './ui/select';

interface SafeSelectProps extends SelectProps {
  children: React.ReactNode;
}

export default function SafeSelect({ children, onValueChange, ...props }: SafeSelectProps) {
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
