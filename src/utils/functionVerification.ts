/**
 * Function verification utilities to ensure handlers are properly assigned
 */

/**
 * Verifies that a value is a function and throws descriptive error if not
 * @param value The value to check
 * @param name Name of the function for error reporting
 * @returns The verified function
 */
export const verifyFunction = <T extends (...args: any[]) => any>(
  value: any, 
  name: string
): T => {
  if (value === null || value === undefined) {
    throw new Error(`${name} is null or undefined`);
  }
  
  if (typeof value !== 'function') {
    throw new Error(`${name} is not a function. Type: ${typeof value}, Value: ${value}`);
  }
  
  return value as T;
};

/**
 * Ensures a handler is a function, providing a default if not
 * @param handler The handler to verify
 * @param defaultHandler Default handler to use if verification fails
 * @param name Name for logging
 * @returns Verified function handler
 */
export const ensureFunction = <T extends (...args: any[]) => any>(
  handler: any,
  defaultHandler: T,
  name: string
): T => {
  try {
    return verifyFunction<T>(handler, name);
  } catch (error) {
    console.warn(`ensureFunction: ${error.message}, using default handler`);
    return defaultHandler;
  }
};

/**
 * Creates a safe tab change handler that is guaranteed to be a function
 * @param handler Original handler
 * @param fallbackAction Fallback action if handler fails
 * @returns Safe tab change handler
 */
export const createSafeTabHandler = (
  handler: any,
  fallbackAction: (value: string) => void = (value) => console.log('Fallback tab change:', value)
): ((value: string) => void) => {
  return ensureFunction(
    handler,
    fallbackAction,
    'Tab change handler'
  );
};
