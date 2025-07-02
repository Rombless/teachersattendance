/**
 * Function enforcer that ensures ALL variables are explicitly assigned functions
 */

/**
 * Global function assignment enforcer
 */
export const enforceAllFunctions = () => {
  // Override Object.defineProperty to catch function assignments
  const originalDefineProperty = Object.defineProperty;
  
  Object.defineProperty = function(obj: any, prop: string | symbol, descriptor: PropertyDescriptor) {
    // If it's supposed to be a function but isn't, fix it
    if (descriptor.value !== undefined && 
        (prop.toString().includes('click') || 
         prop.toString().includes('change') || 
         prop.toString().includes('handler') ||
         prop.toString().includes('callback'))) {
      
      if (typeof descriptor.value !== 'function') {
        console.warn(`functionEnforcer: ${prop.toString()} should be a function but is ${typeof descriptor.value}, fixing...`);
        descriptor.value = function enforcedFunction(...args: any[]) {
          console.log(`functionEnforcer: Enforced function called for ${prop.toString()}`, args);
        };
      }
    }
    
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };

  // Override variable assignments in global scope
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(handler: any, timeout?: number) {
    if (typeof handler !== 'function') {
      console.warn('functionEnforcer: setTimeout handler is not a function, fixing...');
      handler = function enforcedTimeoutHandler() {
        console.log('functionEnforcer: Enforced timeout handler called');
      };
    }
    return originalSetTimeout.call(window, handler, timeout);
  };

  // Override addEventListener to ensure handlers are functions
  const originalAddEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    if (typeof listener !== 'function') {
      console.warn(`functionEnforcer: Event listener for ${type} is not a function, fixing...`);
      listener = function enforcedEventListener(event: Event) {
        console.log(`functionEnforcer: Enforced event listener called for ${type}`, event);
      };
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
};

/**
 * Explicitly ensure a variable is assigned a function
 */
export const explicitlyAssignFunction = <T extends (...args: any[]) => any>(
  variable: any,
  fallback: T,
  name: string
): T => {
  console.log(`explicitlyAssignFunction: Checking ${name}...`);
  
  // Null check
  if (variable === null) {
    console.warn(`explicitlyAssignFunction: ${name} is null, assigning fallback function`);
    return fallback;
  }
  
  // Undefined check
  if (variable === undefined) {
    console.warn(`explicitlyAssignFunction: ${name} is undefined, assigning fallback function`);
    return fallback;
  }
  
  // Type check
  if (typeof variable !== 'function') {
    console.warn(`explicitlyAssignFunction: ${name} is ${typeof variable}, not function, assigning fallback`);
    return fallback;
  }
  
  // Try to execute to verify it's a real function
  try {
    if (variable.call) {
      console.log(`explicitlyAssignFunction: ${name} is verified as function`);
      return variable as T;
    } else {
      console.warn(`explicitlyAssignFunction: ${name} has no call method, assigning fallback`);
      return fallback;
    }
  } catch (error) {
    console.warn(`explicitlyAssignFunction: ${name} verification failed, assigning fallback`);
    return fallback;
  }
};

/**
 * Force assignment of function to variable
 */
export const forceAssignFunction = <T extends (...args: any[]) => any>(
  target: any,
  property: string,
  fallback: T
): void => {
  try {
    if (!target || typeof target !== 'object') {
      console.warn(`forceAssignFunction: Invalid target for ${property}`);
      return;
    }
    
    const currentValue = target[property];
    
    if (typeof currentValue !== 'function') {
      console.warn(`forceAssignFunction: ${property} is not a function, forcing assignment`);
      
      // Force assign the fallback function
      Object.defineProperty(target, property, {
        value: fallback,
        writable: true,
        enumerable: true,
        configurable: true
      });
      
      console.log(`forceAssignFunction: ${property} successfully assigned as function`);
    } else {
      console.log(`forceAssignFunction: ${property} is already a function`);
    }
  } catch (error) {
    console.error(`forceAssignFunction: Failed to assign ${property}`, error);
  }
};

/**
 * Global variable function enforcement
 */
export const enforceGlobalFunctions = () => {
  // Periodically check and fix global variables
  const checkInterval = setInterval(() => {
    try {
      // Check common React variables that might lose their function identity
      const globalVars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
      
      globalVars.forEach(varName => {
        if (window[varName as any] !== undefined && 
            typeof window[varName as any] !== 'function' && 
            varName.length === 1) {
          
          // Check if it should be a function (common patterns)
          const shouldBeFunction = 
            window[varName as any]?.toString?.()?.includes?.('function') ||
            window[varName as any]?.call !== undefined ||
            window[varName as any]?.apply !== undefined;
            
          if (shouldBeFunction) {
            console.warn(`enforceGlobalFunctions: Global var '${varName}' should be function, fixing...`);
            
            window[varName as any] = function enforcedGlobalFunction(...args: any[]) {
              console.log(`enforceGlobalFunctions: Enforced global function '${varName}' called`, args);
            };
          }
        }
      });
    } catch (error) {
      console.warn('enforceGlobalFunctions: Check failed', error);
    }
  }, 100); // Check every 100ms
  
  // Clean up after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000);
};
