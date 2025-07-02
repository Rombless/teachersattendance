/**
 * Safe array helper functions to prevent crashes
 */

/**
 * Safely map over an array, handling null/undefined arrays
 */
export function safeMap<T, R>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => R
): R[] {
  try {
    if (!Array.isArray(array)) {
      console.warn('safeMap: Input is not an array:', array);
      return [];
    }
    return array.map(callback);
  } catch (error) {
    console.error('safeMap: Error during mapping:', error);
    return [];
  }
}

/**
 * Safely filter an array, handling null/undefined arrays
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => boolean
): T[] {
  try {
    if (!Array.isArray(array)) {
      console.warn('safeFilter: Input is not an array:', array);
      return [];
    }
    return array.filter(callback);
  } catch (error) {
    console.error('safeFilter: Error during filtering:', error);
    return [];
  }
}

/**
 * Safely get array length, handling null/undefined arrays
 */
export function safeLength<T>(array: T[] | null | undefined): number {
  try {
    if (!Array.isArray(array)) {
      return 0;
    }
    return array.length;
  } catch (error) {
    console.error('safeLength: Error getting length:', error);
    return 0;
  }
}

/**
 * Safely find an item in array
 */
export function safeFind<T>(
  array: T[] | null | undefined,
  callback: (item: T, index: number) => boolean
): T | undefined {
  try {
    if (!Array.isArray(array)) {
      return undefined;
    }
    return array.find(callback);
  } catch (error) {
    console.error('safeFind: Error during find:', error);
    return undefined;
  }
}

/**
 * Safely reduce an array
 */
export function safeReduce<T, R>(
  array: T[] | null | undefined,
  callback: (accumulator: R, current: T, index: number) => R,
  initialValue: R
): R {
  try {
    if (!Array.isArray(array)) {
      return initialValue;
    }
    return array.reduce(callback, initialValue);
  } catch (error) {
    console.error('safeReduce: Error during reduce:', error);
    return initialValue;
  }
}
