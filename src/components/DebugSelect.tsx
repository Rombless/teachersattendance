/**
 * Debug wrapper for Select to catch empty string values
 */
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DebugSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  debugId?: string;
}

export function DebugSelect({ value, onValueChange, placeholder, children, debugId }: DebugSelectProps) {
  // Log any potential issues
  React.useEffect(() => {
    if (value === '') {
      console.error(`DebugSelect ${debugId}: Empty string value detected!`);
    }
  }, [value, debugId]);

  // Ensure value is never empty string
  const safeValue = value === '' ? 'debug-none' : value;

  return (
    <Select value={safeValue} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="debug-none">Select option</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}
