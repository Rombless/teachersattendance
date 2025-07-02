/**
 * Safe select helpers to prevent crashes with select components
 */

/**
 * Safely filter items for select components
 */
export function safeFilterForSelect<T>(items: T[] | null | undefined): T[] {
  try {
    if (!Array.isArray(items)) {
      console.warn('safeFilterForSelect: Input is not an array:', items);
      return [];
    }
    
    return items.filter(item => {
      if (!item) return false;
      
      // Check if item has required properties for select
      if (typeof item === 'object') {
        return 'id' in item && 'name' in item;
      }
      
      return true;
    });
  } catch (error) {
    console.error('safeFilterForSelect: Error filtering items:', error);
    return [];
  }
}

/**
 * Safely get select value, ensuring it's a string
 */
export function safeSelectValue(value: any): string {
  try {
    if (value === null || value === undefined) {
      return 'none';
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    return String(value);
  } catch (error) {
    console.error('safeSelectValue: Error converting value:', error);
    return 'none';
  }
}

/**
 * Safely handle select change
 */
export function safeSelectChange(
  callback: (value: string) => void,
  errorMessage?: string
) {
  return (value: string) => {
    try {
      if (typeof callback === 'function') {
        callback(value);
      } else {
        console.error('safeSelectChange: Callback is not a function');
      }
    } catch (error) {
      console.error(errorMessage || 'Safe select change error:', error);
    }
  };
}
