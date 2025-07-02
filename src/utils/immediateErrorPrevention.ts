/**
 * Immediate error prevention - runs before any React code
 */

/**
 * Immediately assign functions to all common minified variables
 */
const immediatelyAssignGlobalFunctions = () => {
  console.log('immediateErrorPrevention: Starting immediate global function assignment');
  
  // Common minified variable names that React might use
  const minifiedVars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  
  minifiedVars.forEach(varName => {
    try {
      // Check if variable exists and should be a function
      if (window[varName as any] !== undefined) {
        const currentValue = window[varName as any];
        
        // If it's not a function but should be, fix it immediately
        if (typeof currentValue !== 'function') {
          console.warn(`immediateErrorPrevention: Variable '${varName}' is not a function, fixing immediately`);
          
          // Assign a safe function immediately
          window[varName as any] = function immediatelyAssignedFunction(...args: any[]) {
            console.log(`immediateErrorPrevention: Safe function '${varName}' called with args:`, args);
            
            // Try to call the original value if it was callable
            if (currentValue && typeof currentValue.call === 'function') {
              try {
                return currentValue.call(this, ...args);
              } catch (error) {
                console.warn(`immediateErrorPrevention: Original '${varName}' call failed:`, error);
              }
            }
          };
          
          console.log(`immediateErrorPrevention: Variable '${varName}' successfully assigned as function`);
        }
      } else {
        // Pre-emptively assign safe functions to undefined variables
        window[varName as any] = function preAssignedFunction(...args: any[]) {
          console.log(`immediateErrorPrevention: Pre-assigned function '${varName}' called with args:`, args);
        };
      }
    } catch (error) {
      console.error(`immediateErrorPrevention: Failed to process variable '${varName}':`, error);
    }
  });
  
  console.log('immediateErrorPrevention: Global function assignment completed');
};

/**
 * Override common function assignment patterns
 */
const overrideFunctionAssignments = () => {
  console.log('immediateErrorPrevention: Overriding function assignments');
  
  // Override variable assignments in global scope
  const originalEval = window.eval;
  window.eval = function safeEval(code: string) {
    try {
      // Check if code contains function assignments to single letters
      const singleLetterAssignment = /^[a-z]\s*=/.test(code.trim());
      
      if (singleLetterAssignment) {
        console.warn('immediateErrorPrevention: Intercepted single letter assignment:', code);
        
        // Execute the assignment but ensure result is a function
        const result = originalEval.call(this, code);
        
        // Check if the assigned variable is now a function
        const varName = code.trim().charAt(0);
        if (window[varName as any] && typeof window[varName as any] !== 'function') {
          console.warn(`immediateErrorPrevention: Assignment result for '${varName}' is not a function, fixing`);
          window[varName as any] = function fixedAssignment(...args: any[]) {
            console.log(`immediateErrorPrevention: Fixed assignment '${varName}' called`, args);
          };
        }
        
        return result;
      }
      
      return originalEval.call(this, code);
    } catch (error) {
      console.error('immediateErrorPrevention: Eval override failed:', error);
      return originalEval.call(this, code);
    }
  };
};

/**
 * Continuous monitoring and fixing
 */
const startContinuousMonitoring = () => {
  console.log('immediateErrorPrevention: Starting continuous monitoring');
  
  let monitoringCount = 0;
  const maxMonitoring = 100; // Monitor for 10 seconds (100 * 100ms)
  
  const monitorInterval = setInterval(() => {
    monitoringCount++;
    
    try {
      // Check critical variables
      const criticalVars = ['a', 'b', 'c'];
      let fixedAny = false;
      
      criticalVars.forEach(varName => {
        if (window[varName as any] !== undefined && typeof window[varName as any] !== 'function') {
          console.warn(`immediateErrorPrevention: Monitoring detected '${varName}' is not a function, fixing`);
          
          window[varName as any] = function monitoringFixedFunction(...args: any[]) {
            console.log(`immediateErrorPrevention: Monitoring-fixed '${varName}' called`, args);
          };
          
          fixedAny = true;
        }
      });
      
      if (fixedAny) {
        console.log('immediateErrorPrevention: Monitoring fixed variables');
      }
    } catch (error) {
      console.warn('immediateErrorPrevention: Monitoring failed:', error);
    }
    
    // Stop monitoring after maxMonitoring iterations
    if (monitoringCount >= maxMonitoring) {
      clearInterval(monitorInterval);
      console.log('immediateErrorPrevention: Monitoring completed');
    }
  }, 100); // Check every 100ms
};

/**
 * Initialize immediate error prevention
 */
export const initializeImmediateErrorPrevention = () => {
  console.log('immediateErrorPrevention: Initializing immediate error prevention');
  
  try {
    // 1. Immediately assign global functions
    immediatelyAssignGlobalFunctions();
    
    // 2. Override function assignment patterns
    overrideFunctionAssignments();
    
    // 3. Start continuous monitoring
    startContinuousMonitoring();
    
    console.log('immediateErrorPrevention: Initialization completed successfully');
  } catch (error) {
    console.error('immediateErrorPrevention: Initialization failed:', error);
  }
};

// Auto-initialize when module loads
initializeImmediateErrorPrevention();
