/**
 * Safe function utilities to prevent crashes
 */

/**
 * Check if a value is a valid ID (string with content)
 */
export function isValidId(id: any): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

/**
 * Check if an object has required properties
 */
export function isValidObject(obj: any, requiredKeys: string[]): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return requiredKeys.every(key => obj.hasOwnProperty(key));
}

/**
 * Safely execute a function with error handling
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  errorMessage?: string
): T {
  try {
    return fn();
  } catch (error) {
    console.error(errorMessage || 'Safe execute error:', error);
    return fallback;
  }
}

/**
 * Create a safe onClick handler
 */
export function safeOnClick<T>(
  handler: (arg: T) => void,
  errorMessage?: string
) {
  return (arg: T) => {
    try {
      if (typeof handler === 'function') {
        handler(arg);
      } else {
        console.error('safeOnClick: Handler is not a function');
      }
    } catch (error) {
      console.error(errorMessage || 'Safe onClick error:', error);
    }
  };
}

/**
 * Create a safe store method wrapper
 */
export function safeStoreMethod(store: any, methodName: string) {
  return (...args: any[]) => {
    try {
      if (store && typeof store[methodName] === 'function') {
        return store[methodName](...args);
      } else {
        console.error(`safeStoreMethod: ${methodName} is not a function on store`);
      }
    } catch (error) {
      console.error(`safeStoreMethod: Error calling ${methodName}:`, error);
    }
  };
}

/**
 * Create a universal safe handler for any function
 */
export function createUniversalSafeHandler<T extends any[]>(
  handler: (...args: T) => void,
  errorMessage?: string
) {
  return (...args: T) => {
    try {
      if (typeof handler === 'function') {
        handler(...args);
      } else {
        console.error('createUniversalSafeHandler: Handler is not a function');
      }
    } catch (error) {
      console.error(errorMessage || 'Universal safe handler error:', error);
    }
  };
}

/**
 * Safe form submit handler
 */
export function safeFormSubmit(
  handler: (e: React.FormEvent) => void,
  errorMessage?: string
) {
  return (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (typeof handler === 'function') {
        handler(e);
      } else {
        console.error('safeFormSubmit: Handler is not a function');
      }
    } catch (error) {
      console.error(errorMessage || 'Safe form submit error:', error);
    }
  };
}
