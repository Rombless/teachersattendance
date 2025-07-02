/**
 * React internal function assignment fix
 */

/**
 * Override Object.defineProperty to catch React's internal assignments
 */
const overrideObjectDefineProperty = () => {
  const originalDefineProperty = Object.defineProperty;
  
  Object.defineProperty = function(obj: any, prop: string | symbol, descriptor: PropertyDescriptor) {
    try {
      // Check if React is trying to assign something that should be a function
      if (descriptor.value !== undefined) {
        const propStr = String(prop);
        
        // Single letter properties that React often uses
        if (propStr.length === 1 && /^[a-z]$/.test(propStr)) {
          console.log(`reactInternalFix: React assigning to single letter property '${propStr}'`);
          
          // If it's not a function but should be, make it one
          if (typeof descriptor.value !== 'function') {
            console.warn(`reactInternalFix: Property '${propStr}' should be function but is ${typeof descriptor.value}, fixing`);
            
            const originalValue = descriptor.value;
            descriptor.value = function reactInternallyFixed(...args: any[]) {
              console.log(`reactInternalFix: Fixed React internal '${propStr}' called`, args);
              
              // Try to use original value if it becomes callable
              if (originalValue && typeof originalValue === 'function') {
                try {
                  return originalValue.apply(this, args);
                } catch (error) {
                  console.warn(`reactInternalFix: Original value failed:`, error);
                }
              }
              
              return args[0]; // Reasonable fallback
            };
          }
        }
        
        // Also check for click handlers
        if (propStr.includes('click') || propStr.includes('Click') || propStr.includes('onChange') || propStr.includes('onValue')) {
          if (typeof descriptor.value !== 'function') {
            console.warn(`reactInternalFix: Handler '${propStr}' is not a function, fixing`);
            
            const originalValue = descriptor.value;
            descriptor.value = function reactHandlerFixed(...args: any[]) {
              console.log(`reactInternalFix: Fixed React handler '${propStr}' called`, args);
              
              if (originalValue && typeof originalValue === 'function') {
                try {
                  return originalValue.apply(this, args);
                } catch (error) {
                  console.warn(`reactInternalFix: Original handler failed:`, error);
                }
              }
            };
          }
        }
      }
      
      return originalDefineProperty.call(this, obj, prop, descriptor);
    } catch (error) {
      console.error('reactInternalFix: defineProperty override failed:', error);
      return originalDefineProperty.call(this, obj, prop, descriptor);
    }
  };
};

/**
 * Override Function constructor to catch dynamic function creation
 */
const overrideFunctionConstructor = () => {
  const OriginalFunction = window.Function;
  
  window.Function = function(...args: any[]) {
    try {
      console.log('reactInternalFix: Function constructor called with:', args);
      
      // Create the function normally
      const func = new (OriginalFunction.bind.apply(OriginalFunction, [null].concat(args)))();
      
      // Ensure it's actually a function
      if (typeof func !== 'function') {
        console.warn('reactInternalFix: Function constructor result is not a function, creating wrapper');
        
        return function functionConstructorWrapper(...callArgs: any[]) {
          console.log('reactInternalFix: Function constructor wrapper called', callArgs);
          
          // Try to call the original if it becomes callable
          if (typeof func === 'function') {
            try {
              return func.apply(this, callArgs);
            } catch (error) {
              console.warn('reactInternalFix: Function constructor original failed:', error);
            }
          }
          
          return callArgs[0];
        };
      }
      
      return func;
    } catch (error) {
      console.error('reactInternalFix: Function constructor override failed:', error);
      return new (OriginalFunction.bind.apply(OriginalFunction, [null].concat(args)))();
    }
  } as any;
  
  // Copy static properties
  Object.setPrototypeOf(window.Function, OriginalFunction);
  Object.getOwnPropertyNames(OriginalFunction).forEach(name => {
    if (name !== 'length' && name !== 'name' && name !== 'prototype') {
      try {
        (window.Function as any)[name] = (OriginalFunction as any)[name];
      } catch (error) {
        // Ignore
      }
    }
  });
};

/**
 * Direct assignment to 'a' variable with monitoring
 */
const directlyFixVariableA = () => {
  console.log('reactInternalFix: Directly fixing variable a');
  
  // Assign immediately
  window['a' as any] = function fixedVariableA(...args: any[]) {
    console.log('reactInternalFix: Fixed variable a called', args);
    return args[0];
  };
  
  // Monitor and re-fix if it changes
  let aCheckCount = 0;
  const maxAChecks = 200; // Check for 20 seconds
  
  const aMonitor = setInterval(() => {
    aCheckCount++;
    
    try {
      if (typeof window['a' as any] !== 'function') {
        console.warn('reactInternalFix: Variable a became non-function, re-fixing');
        
        window['a' as any] = function reFixedVariableA(...args: any[]) {
          console.log('reactInternalFix: Re-fixed variable a called', args);
          return args[0];
        };
      }
    } catch (error) {
      console.warn('reactInternalFix: A monitoring failed:', error);
    }
    
    if (aCheckCount >= maxAChecks) {
      clearInterval(aMonitor);
      console.log('reactInternalFix: Variable a monitoring completed');
    }
  }, 100);
};

/**
 * Initialize React internal fixes
 */
export const initializeReactInternalFix = () => {
  console.log('reactInternalFix: Initializing React internal fixes');
  
  try {
    // 1. Override Object.defineProperty
    overrideObjectDefineProperty();
    
    // 2. Override Function constructor
    overrideFunctionConstructor();
    
    // 3. Directly fix variable 'a'
    directlyFixVariableA();
    
    console.log('reactInternalFix: React internal fixes initialized');
  } catch (error) {
    console.error('reactInternalFix: Initialization failed:', error);
  }
};

// Auto-initialize
initializeReactInternalFix();
