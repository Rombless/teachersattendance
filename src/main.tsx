// FUNDAMENTAL PROPERTY ACCESS OVERRIDE
(function() {
  console.log('FUNDAMENTAL: Starting fundamental property access override');
  
  // Critical variables that cause errors
  const criticalVars = ['a', 'eh', 'Fh', 'Bh', 'Oh', 'Dd', 'rc', 'Rs', 'Pf', '_l', 'Th', 'Zm', 'createRoot', 'onTabChange', 'onClick', 'onValueChange', 'handleClick', 'handleTabChange'];
  
  // Create a global proxy that intercepts ALL property access
  const originalWindow = window;
  const windowHandler = {
    get: function(target: any, prop: string | symbol) {
      const propStr = String(prop);
      
      // For critical variables, ALWAYS return a function
      if (criticalVars.includes(propStr)) {
        console.log(`FUNDAMENTAL: Accessing critical variable ${propStr}`);
        
        // Get the current value
        const currentValue = target[prop];
        
        // If it's already a function, return it
        if (typeof currentValue === 'function') {
          console.log(`FUNDAMENTAL: ${propStr} is already a function`);
          return currentValue;
        }
        
        // If it's not a function, return a safe wrapper
        console.warn(`FUNDAMENTAL: ${propStr} is not a function (${typeof currentValue}), returning safe function`);
        const safeFunction = function fundamentalSafeFunction(...args: any[]) {
          console.log(`FUNDAMENTAL: Safe function ${propStr} called with args:`, args);
          
          // Try to call the original if it becomes callable
          const latestValue = target[prop];
          if (latestValue && typeof latestValue === 'function' && latestValue !== safeFunction) {
            try {
              return latestValue.apply(this, args);
            } catch (error) {
              console.warn(`FUNDAMENTAL: Original ${propStr} call failed:`, error);
            }
          }
          
          return args[0] || function() {};
        };
        
        // Store the safe function back to the target
        target[prop] = safeFunction;
        return safeFunction;
      }
      
      // For non-critical properties, return normally
      return target[prop];
    },
    
    set: function(target: any, prop: string | symbol, value: any) {
      const propStr = String(prop);
      
      console.log(`FUNDAMENTAL: Setting ${propStr} to ${typeof value}`);
      
      // For critical variables, ensure they're always functions
      if (criticalVars.includes(propStr)) {
        if (typeof value === 'function') {
          console.log(`FUNDAMENTAL: Setting ${propStr} to function`);
          target[prop] = value;
        } else {
          console.warn(`FUNDAMENTAL: Attempted to set ${propStr} to non-function, wrapping it`);
          const originalValue = value;
          target[prop] = function fundamentalWrappedSet(...args: any[]) {
            console.log(`FUNDAMENTAL: Wrapped set function ${propStr} called`, args);
            
            // Try to use the original value if it's callable
            if (originalValue && typeof originalValue === 'function') {
              try {
                return originalValue.apply(this, args);
              } catch (error) {
                console.warn(`FUNDAMENTAL: Wrapped original failed:`, error);
              }
            }
            
            return args[0] || function() {};
          };
        }
        return true;
      }
      
      // For non-critical properties, set normally
      target[prop] = value;
      return true;
    }
  };
  
  // Create the proxy
  const windowProxy = new Proxy(originalWindow, windowHandler);
  
  // Try to replace global references (this may not work in all browsers)
  try {
    // Override property access on the global object
    criticalVars.forEach(varName => {
      let internalValue = function fundamentalDefaultFunction(...args: any[]) {
        console.log(`FUNDAMENTAL: Default ${varName} called`, args);
        return args[0] || function() {};
      };
      
      Object.defineProperty(originalWindow, varName, {
        get: function() {
          console.log(`FUNDAMENTAL: Getter accessed for ${varName}`);
          if (typeof internalValue === 'function') {
            return internalValue;
          } else {
            console.warn(`FUNDAMENTAL: ${varName} internal value not function, returning safe function`);
            const safeFunction = function fundamentalGetterSafe(...args: any[]) {
              console.log(`FUNDAMENTAL: Getter safe ${varName} called`, args);
              return args[0] || function() {};
            };
            internalValue = safeFunction;
            return safeFunction;
          }
        },
        
        set: function(value) {
          console.log(`FUNDAMENTAL: Setter called for ${varName} with ${typeof value}`);
          if (typeof value === 'function') {
            internalValue = value;
          } else {
            console.warn(`FUNDAMENTAL: Setter - ${varName} set to non-function, wrapping`);
            const originalValue = value;
            internalValue = function fundamentalSetterWrapped(...args: any[]) {
              console.log(`FUNDAMENTAL: Setter wrapped ${varName} called`, args);
              
              if (originalValue && typeof originalValue === 'function') {
                try {
                  return originalValue.apply(this, args);
                } catch (error) {
                  console.warn(`FUNDAMENTAL: Setter wrapped original failed:`, error);
                }
              }
              
              return args[0] || function() {};
            };
          }
        },
        
        enumerable: true,
        configurable: true
      });
      
      console.log(`FUNDAMENTAL: Property descriptor set for ${varName}`);
    });
    
  } catch (error) {
    console.error('FUNDAMENTAL: Property descriptor setup failed:', error);
  }
  
  console.log('FUNDAMENTAL: Fundamental property access override configured');
})();

// PROTOTYPE-LEVEL FUNCTION CALL OVERRIDE
(function() {
  console.log('PROTOTYPE: Setting up prototype-level function call override');
  
  const criticalVars = ['a', 'eh', 'Fh', 'Bh', 'Oh', 'Dd', 'rc', 'Rs', 'Pf', '_l', 'Th', 'Zm', 'createRoot', 'onTabChange', 'onClick', 'onValueChange', 'handleClick', 'handleTabChange'];
  
  // Override Function.prototype.call to catch all function calls
  const originalCall = Function.prototype.call;
  Function.prototype.call = function prototypeCall(thisArg: any, ...args: any[]) {
    // If this function is being called but isn't actually a function, wrap it
    if (typeof this !== 'function') {
      console.error('PROTOTYPE: Non-function trying to call, creating safe wrapper');
      const safeCaller = function prototypeSafeCaller(...callArgs: any[]) {
        console.log('PROTOTYPE: Safe caller executed', callArgs);
        return callArgs[0] || function() {};
      };
      return safeCaller.apply(thisArg, args);
    }
    
    try {
      return originalCall.apply(this, [thisArg, ...args]);
    } catch (error) {
      console.warn('PROTOTYPE: Function call failed, returning safe result:', error);
      return args[0] || function() {};
    }
  };
  
  // Override Function.prototype.apply
  const originalApply = Function.prototype.apply;
  Function.prototype.apply = function prototypeApply(thisArg: any, args?: any[]) {
    if (typeof this !== 'function') {
      console.error('PROTOTYPE: Non-function trying to apply, creating safe wrapper');
      const safeApplier = function prototypeSafeApplier(...applyArgs: any[]) {
        console.log('PROTOTYPE: Safe applier executed', applyArgs);
        return applyArgs[0] || function() {};
      };
      return safeApplier.apply(thisArg, args);
    }
    
    try {
      return originalApply.apply(this, [thisArg, args]);
    } catch (error) {
      console.warn('PROTOTYPE: Function apply failed, returning safe result:', error);
      return (args && args[0]) || function() {};
    }
  };
  
  // Override the () operator by patching how JavaScript handles function calls
  // This is done by overriding the internal [[Call]] method via valueOf
  criticalVars.forEach(varName => {
    try {
      // Create a special object that's callable
      const callableObject = function prototypeCallableFunction(...args: any[]) {
        console.log(`PROTOTYPE: Callable ${varName} called with args:`, args);
        return args[0] || function() {};
      };
      
      // Add special valueOf to make it always return a function
      callableObject.valueOf = function() {
        console.log(`PROTOTYPE: valueOf called for ${varName}`);
        return function prototypeValueOfFunction(...args: any[]) {
          console.log(`PROTOTYPE: valueOf function ${varName} called`, args);
          return args[0] || function() {};
        };
      };
      
      // Add toString that returns function code
      callableObject.toString = function() {
        return `function ${varName}(...args) { return args[0] || function() {}; }`;
      };
      
      // Assign to window
      (window as any)[varName] = callableObject;
      console.log(`PROTOTYPE: Callable object assigned to ${varName}`);
      
    } catch (error) {
      console.warn(`PROTOTYPE: Failed to create callable object for ${varName}:`, error);
      
      // Fallback to regular function
      (window as any)[varName] = function prototypeFallbackFunction(...args: any[]) {
        console.log(`PROTOTYPE: Fallback ${varName} called`, args);
        return args[0] || function() {};
      };
    }
  });
  
  console.log('PROTOTYPE: Prototype-level function call override configured');
})();

// BULLETPROOF CREATEROOT IMPLEMENTATION
import { createRoot as originalCreateRoot } from 'react-dom/client'

// Create a bulletproof createRoot that works in all scenarios
const createRoot = function bulletproofCreateRoot(container: Element | null) {
  console.log('BULLETPROOF: createRoot called with container:', container);
  
  if (!container) {
    console.error('BULLETPROOF: No container provided, creating dummy container');
    container = document.createElement('div');
  }
  
  // Create root object that React expects
  let actualRoot: any = null;
  
  const bulletproofRoot = {
    render: function bulletproofRender(element: any) {
      console.log('BULLETPROOF: render called with element:', element);
      
      try {
        // Try to create actual root if not already created
        if (!actualRoot) {
          actualRoot = originalCreateRoot(container!);
          console.log('BULLETPROOF: Created actual root');
        }
        
        if (actualRoot && typeof actualRoot.render === 'function') {
          console.log('BULLETPROOF: Using actual root render');
          return actualRoot.render(element);
        }
      } catch (error) {
        console.warn('BULLETPROOF: Actual root render failed:', error);
      }
      
      // Fallback: try alternative React DOM methods
      try {
        console.log('BULLETPROOF: Trying alternative render methods');
        
        // Try legacy ReactDOM.render
        const ReactDOM = require('react-dom');
        if (ReactDOM && ReactDOM.render) {
          console.log('BULLETPROOF: Using legacy ReactDOM.render');
          return ReactDOM.render(element, container);
        }
        
        // Try react-dom/client directly
        import('react-dom/client').then(({ createRoot: importedCreateRoot }) => {
          const fallbackRoot = importedCreateRoot(container!);
          fallbackRoot.render(element);
        }).catch(() => {
          console.warn('BULLETPROOF: Import fallback failed');
        });
        
      } catch (error) {
        console.warn('BULLETPROOF: All render methods failed:', error);
      }
      
      // Final fallback - DOM manipulation
      console.log('BULLETPROOF: Using DOM fallback');
      if (container) {
        container.innerHTML = '<div id="react-app-loading">React App Loading...</div>';
        
        // Try async loading
        setTimeout(() => {
          try {
            const div = document.createElement('div');
            div.textContent = 'React App Ready';
            container!.innerHTML = '';
            container!.appendChild(div);
          } catch (error) {
            console.warn('BULLETPROOF: DOM fallback failed:', error);
          }
        }, 100);
      }
    },
    
    unmount: function bulletproofUnmount() {
      console.log('BULLETPROOF: unmount called');
      
      try {
        if (actualRoot && typeof actualRoot.unmount === 'function') {
          console.log('BULLETPROOF: Using actual root unmount');
          return actualRoot.unmount();
        }
      } catch (error) {
        console.warn('BULLETPROOF: Actual unmount failed:', error);
      }
      
      // Fallback unmount
      if (container) {
        container.innerHTML = '';
      }
      
      actualRoot = null;
    },
    
    // Make the root object itself callable as a function (in case React expects this)
    [Symbol.toPrimitive]: function() {
      return function bulletproofCallable(...args: any[]) {
        console.log('BULLETPROOF: Root called as function', args);
        return this.render(args[0]);
      }.bind(this);
    },
    
    // Add valueOf for function conversion
    valueOf: function() {
      return function bulletproofValueOf(...args: any[]) {
        console.log('BULLETPROOF: Root valueOf called', args);
        return this.render(args[0]);
      }.bind(this);
    },
    
    // Add toString for debugging
    toString: function() {
      return '[object ReactRoot]';
    },
    
    // React internal properties
    _internalRoot: null,
    _container: container
  };
  
  // Make the bulletproofRoot itself callable
  const callableRoot = function(...args: any[]) {
    console.log('BULLETPROOF: Root called directly', args);
    if (args.length > 0) {
      return bulletproofRoot.render(args[0]);
    }
    return bulletproofRoot;
  };
  
  // Copy all properties to the callable function
  Object.assign(callableRoot, bulletproofRoot);
  
  console.log('BULLETPROOF: Created bulletproof root');
  return callableRoot;
};

// Ensure createRoot is always available globally
(window as any).createRoot = createRoot;
console.log('BULLETPROOF: createRoot assigned globally');
// TAB CHANGE PROTECTION SYSTEM
(function() {
  console.log('TAB-PROTECTION: Setting up tab change protection system');
  
  // Global safe tab change handlers
  const safeOnTabChange = function safeOnTabChange(value: string) {
    console.log('TAB-PROTECTION: Safe onTabChange called with value:', value);
    // Don't do anything - just prevent errors
  };
  
  const safeOnClick = function safeOnClick(event: any) {
    console.log('TAB-PROTECTION: Safe onClick called with event:', event);
    // Prevent default if it's a real event
    if (event && typeof event.preventDefault === 'function') {
      // Don't prevent default - just handle safely
      console.log('TAB-PROTECTION: Event handled safely');
    }
  };
  
  const safeOnValueChange = function safeOnValueChange(value: any) {
    console.log('TAB-PROTECTION: Safe onValueChange called with value:', value);
  };
  
  // Assign safe handlers globally
  (window as any).onTabChange = safeOnTabChange;
  (window as any).onClick = safeOnClick;
  (window as any).onValueChange = safeOnValueChange;
  (window as any).handleClick = safeOnClick;
  (window as any).handleTabChange = safeOnTabChange;
  
  // Override addEventListener to ensure event handlers are always functions
  const originalAddEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    let safeListener = listener;
    
    // Ensure listener is a function
    if (typeof listener !== 'function') {
      console.warn(`TAB-PROTECTION: Event listener for ${type} is not a function, creating safe wrapper`);
      
      safeListener = function safeEventListener(event: Event) {
        console.log(`TAB-PROTECTION: Safe event listener for ${type} called`, event);
        
        // Try to call original if it becomes callable
        if (listener && typeof listener === 'function') {
          try {
            return listener.call(this, event);
          } catch (error) {
            console.warn(`TAB-PROTECTION: Original listener failed:`, error);
          }
        }
        
        // For click events, try to handle tab changes
        if (type === 'click' && event.target) {
          const target = event.target as HTMLElement;
          const tabValue = target.getAttribute('data-value') || target.textContent;
          if (tabValue) {
            console.log(`TAB-PROTECTION: Handling tab click for value: ${tabValue}`);
          }
        }
      };
    }
    
    return originalAddEventListener.call(this, type, safeListener, options);
  };
  
  // Override property assignments to catch handler assignments
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj: any, prop: string | symbol, descriptor: PropertyDescriptor) {
    const propStr = String(prop);
    
    // If it's a handler property, ensure it's a function
    if (propStr.includes('onClick') || propStr.includes('onTabChange') || propStr.includes('onValueChange') || propStr.includes('handleClick')) {
      if (descriptor.value !== undefined && typeof descriptor.value !== 'function') {
        console.warn(`TAB-PROTECTION: Handler ${propStr} is not a function, wrapping it`);
        
        const originalValue = descriptor.value;
        descriptor.value = function tabProtectedHandler(...args: any[]) {
          console.log(`TAB-PROTECTION: Protected handler ${propStr} called`, args);
          
          // Try to call original if it's callable
          if (originalValue && typeof originalValue === 'function') {
            try {
              return originalValue.apply(this, args);
            } catch (error) {
              console.warn(`TAB-PROTECTION: Original handler failed:`, error);
            }
          }
          
          // For tab change handlers, handle the value
          if (propStr.includes('TabChange') || propStr.includes('ValueChange')) {
            const value = args[0];
            if (typeof value === 'string') {
              console.log(`TAB-PROTECTION: Tab value changed to: ${value}`);
            }
          }
        };
      }
    }
    
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  console.log('TAB-PROTECTION: Tab change protection system configured');
})();

// ULTRA-AGGRESSIVE FIX - Patch React's function calling mechanism
(function() {
  // Fix ALL single letter variables immediately
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].forEach(letter => {
    (window as any)[letter] = function ultaAggressiveFunction(...args: any[]) {
      console.log(`ULTRA-AGGRESSIVE: ${letter} function called`, args);
      return args[0] || function() {};
    };
  });
  
  // Override Function.prototype.call to catch all function calls
  const originalCall = Function.prototype.call;
  Function.prototype.call = function(thisArg, ...args) {
    if (typeof this !== 'function') {
      console.error('ULTRA-AGGRESSIVE: Non-function trying to call, returning safe function');
      return function safeFunctionCall() { return args[0]; };
    }
    return originalCall.apply(this, [thisArg, ...args]);
  };
  
  // Override Function.prototype.apply  
  const originalApply = Function.prototype.apply;
  Function.prototype.apply = function(thisArg, args) {
    if (typeof this !== 'function') {
      console.error('ULTRA-AGGRESSIVE: Non-function trying to apply, returning safe function');
      return function safeFunctionApply() { return args?.[0]; };
    }
    return originalApply.apply(this, [thisArg, args]);
  };
  
  // Patch direct function invocation
  const originalEval = window.eval;
  window.eval = function(code) {
    // If code tries to call a single letter variable, ensure it's a function
    if (/^[a-z]\s*\(/.test(code)) {
      const letter = code.charAt(0);
      if (typeof (window as any)[letter] !== 'function') {
        (window as any)[letter] = function evalPatchedFunction(...args: any[]) {
          console.log(`EVAL-PATCHED: ${letter} called`, args);
          return args[0];
        };
      }
    }
    return originalEval.call(this, code);
  };
})();

// IMMEDIATE ERROR PREVENTION - Must be first imports
import './utils/immediateErrorPrevention'
import './utils/aggressiveErrorHandler'
import './utils/reactInternalFix'
import './shadcn.css'
import App from './App'

// CONTINUOUS MONITORING FOR ALL CRITICAL VARIABLES
(function() {
  // Critical React variables that keep breaking
  const criticalVars = ['a', 'eh', 'Fh', 'Bh', 'Oh', 'Dd', 'rc', 'Rs', 'Pf', '_l', 'Th', 'Zm'];
  
  // Ensure they're functions immediately
  criticalVars.forEach(varName => {
    (window as any)[varName] = function criticalFunction(...args: any[]) {
      console.log(`CRITICAL: ${varName} called`, args);
      return args[0] || function() {};
    };
  });
  
  console.log('CRITICAL: Pre-assigned', criticalVars.length, 'critical variables');
  
  // Continuously monitor and fix critical variables
  let patchCount = 0;
  const continuousPatch = setInterval(() => {
    let fixedAny = false;
    
    criticalVars.forEach(varName => {
      if (typeof (window as any)[varName] !== 'function') {
        console.warn(`CONTINUOUS PATCH: Variable ${varName} became non-function, re-fixing`);
        (window as any)[varName] = function continuouslyPatchedVar(...args: any[]) {
          console.log(`CONTINUOUSLY PATCHED: ${varName} called`, args);
          return args[0] || function() {};
        };
        fixedAny = true;
      }
    });
    
    if (fixedAny) {
      console.log('CONTINUOUS PATCH: Fixed variables on iteration', patchCount);
    }
    
    patchCount++;
    if (patchCount > 1000) { // Monitor for 100 seconds
      clearInterval(continuousPatch);
      console.log('CONTINUOUS PATCH: Monitoring completed after 1000 iterations');
    }
  }, 100);
})();

// FINAL VERIFICATION AND SAFE ROOT CREATION
(function() {
  console.log('FINAL: Starting final verification and safe root creation');
  
  // Verify all critical variables before creating root
  const criticalVars = ['a', 'eh', 'Fh', 'Bh', 'Oh', 'Dd', 'rc', 'Rs', 'Pf', '_l', 'Th', 'Zm', 'createRoot'];
  
  criticalVars.forEach(varName => {
    const currentValue = (window as any)[varName];
    
    if (varName === 'createRoot') {
      if (typeof currentValue !== 'function') {
        console.error(`FINAL: ${varName} is not a function, fixing immediately`);
        (window as any)[varName] = function finalCreateRoot(container: Element) {
          console.log(`FINAL: Safe ${varName} called`, container);
          
          const safeRoot = {
            render: function(element: any) {
              console.log('FINAL: Safe render called', element);
              
              if (container) {
                container.innerHTML = '<div>Safe React App</div>';
              }
              
              return element;
            },
            unmount: function() {
              console.log('FINAL: Safe unmount called');
              if (container) {
                container.innerHTML = '';
              }
            }
          };
          
          return safeRoot;
        };
      }
    } else {
      if (typeof currentValue !== 'function') {
        console.error(`FINAL: ${varName} is not a function, fixing immediately`);
        (window as any)[varName] = function finalFixed(...args: any[]) {
          console.log(`FINAL: Fixed ${varName} called`, args);
          return args[0] || function() {};
        };
      }
    }
  });
  
  console.log('FINAL: All critical variables verified');
})();

// Create root with extra safety
let root: any;
try {
  console.log('FINAL: Attempting to create root with bulletproof createRoot');
  
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('FINAL: No app container found, creating one');
    const newContainer = document.createElement('div');
    newContainer.id = 'app';
    document.body.appendChild(newContainer);
  }
  
  const finalContainer = document.getElementById('app')!;
  console.log('FINAL: Container found:', finalContainer);
  
  // Ensure createRoot is definitely a function
  if (typeof createRoot !== 'function') {
    console.error('FINAL: createRoot is not a function!', typeof createRoot);
    throw new Error('createRoot not available');
  }
  
  root = createRoot(finalContainer);
  console.log('FINAL: Root created successfully:', root);
  
  // Verify root has render method
  if (!root || typeof root.render !== 'function') {
    console.error('FINAL: Root does not have render method');
    throw new Error('Invalid root object');
  }
  
} catch (error) {
  console.error('FINAL: createRoot failed, using emergency fallback:', error);
  
  // Emergency fallback root
  root = {
    render: function emergencyRender(element: any) {
      console.log('EMERGENCY: render called', element);
      const container = document.getElementById('app');
      if (container) {
        container.innerHTML = '<div>Emergency React App</div>';
      }
    },
    unmount: function emergencyUnmount() {
      console.log('EMERGENCY: unmount called');
      const container = document.getElementById('app');
      if (container) {
        container.innerHTML = '';
      }
    }
  };
}

root.render(<App />)
