/**
 * Class-based tabs with constructor binding to ensure explicit function assignment
 */
import React from 'react';
import { cn } from '../lib/utils';

interface ClassBasedTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface ClassBasedTabsState {
  currentValue: string;
}

interface ClassBasedTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface ClassBasedTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface ClassBasedTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Context for class-based tabs
 */
const ClassBasedTabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: function defaultContextHandler(value: string) {
    console.log('ClassBasedTabsContext: Default handler called with:', value);
  }
});

/**
 * Class-based tabs component with constructor binding
 */
export class ClassBasedTabs extends React.Component<ClassBasedTabsProps, ClassBasedTabsState> {
  private onValueChange: (value: string) => void;
  private handleInternalValueChange: (value: string) => void;

  constructor(props: ClassBasedTabsProps) {
    super(props);
    
    // Initialize state
    this.state = {
      currentValue: props.value || 'overview'
    };
    
    // EXPLICIT CONSTRUCTOR BINDING - ensures functions are always functions
    this.handleInternalValueChange = this.handleInternalValueChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    
    // Verify bindings are functions
    if (typeof this.handleInternalValueChange !== 'function') {
      console.error('CRITICAL: handleInternalValueChange not bound as function!');
      this.handleInternalValueChange = function boundFallback(value: string) {
        console.log('ClassBasedTabs: Bound fallback called with:', value);
      }.bind(this);
    }
    
    if (typeof this.onValueChange !== 'function') {
      console.error('CRITICAL: onValueChange not bound as function!');
      this.onValueChange = function boundFallback(value: string) {
        console.log('ClassBasedTabs: Bound onValueChange fallback called with:', value);
      }.bind(this);
    }
    
    console.log('ClassBasedTabs: Constructor binding completed');
  }

  /**
   * Internal value change handler - bound in constructor
   */
  handleInternalValueChange(newValue: string): void {
    console.log('ClassBasedTabs: handleInternalValueChange called with:', newValue);
    
    if (typeof newValue === 'string' && newValue.trim() !== '') {
      this.setState({ currentValue: newValue });
      
      // Call external handler if provided
      if (this.props.onValueChange) {
        try {
          if (typeof this.props.onValueChange === 'function') {
            this.props.onValueChange(newValue);
          } else {
            console.warn('ClassBasedTabs: props.onValueChange is not a function');
          }
        } catch (error) {
          console.error('ClassBasedTabs: External handler failed:', error);
        }
      }
    }
  }

  /**
   * Public onValueChange method - bound in constructor
   */
  onValueChange(value: string): void {
    console.log('ClassBasedTabs: onValueChange called with:', value);
    this.handleInternalValueChange(value);
  }

  /**
   * Component did update to sync with props
   */
  componentDidUpdate(prevProps: ClassBasedTabsProps): void {
    if (prevProps.value !== this.props.value && this.props.value) {
      this.setState({ currentValue: this.props.value });
    }
  }

  /**
   * Render method
   */
  render(): JSX.Element {
    const contextValue = {
      value: this.state.currentValue,
      onValueChange: this.onValueChange  // This is guaranteed to be a bound function
    };

    // Verify context value has bound function
    if (typeof contextValue.onValueChange !== 'function') {
      console.error('CRITICAL: Context onValueChange is not a function!');
    }

    return (
      <ClassBasedTabsContext.Provider value={contextValue}>
        <div className={cn('space-y-4', this.props.className)}>
          {this.props.children}
        </div>
      </ClassBasedTabsContext.Provider>
    );
  }
}

/**
 * Class-based tabs list
 */
export class ClassBasedTabsList extends React.Component<ClassBasedTabsListProps> {
  constructor(props: ClassBasedTabsListProps) {
    super(props);
    console.log('ClassBasedTabsList: Constructor completed');
  }

  render(): JSX.Element {
    return (
      <div className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full',
        this.props.className
      )}>
        {this.props.children}
      </div>
    );
  }
}

/**
 * Class-based tabs trigger with constructor-bound click handler
 */
export class ClassBasedTabsTrigger extends React.Component<ClassBasedTabsTriggerProps> {
  private handleClick: () => void;
  
  static contextType = ClassBasedTabsContext;
  context!: React.ContextType<typeof ClassBasedTabsContext>;

  constructor(props: ClassBasedTabsTriggerProps) {
    super(props);
    
    // EXPLICIT CONSTRUCTOR BINDING of click handler
    this.handleClick = this.handleClick.bind(this);
    
    // Verify binding is a function
    if (typeof this.handleClick !== 'function') {
      console.error('CRITICAL: handleClick not bound as function!');
      this.handleClick = function boundClickFallback() {
        console.log('ClassBasedTabsTrigger: Bound click fallback called');
      }.bind(this);
    }
    
    console.log('ClassBasedTabsTrigger: Constructor binding completed for value:', props.value);
  }

  /**
   * Click handler - bound in constructor
   */
  handleClick(): void {
    console.log('ClassBasedTabsTrigger: handleClick called for value:', this.props.value);
    
    if (this.props.disabled) {
      console.log('ClassBasedTabsTrigger: Click ignored - disabled');
      return;
    }
    
    if (!this.props.value || typeof this.props.value !== 'string') {
      console.warn('ClassBasedTabsTrigger: Invalid value', this.props.value);
      return;
    }
    
    // Get context handler
    const contextHandler = this.context?.onValueChange;
    
    if (!contextHandler) {
      console.error('ClassBasedTabsTrigger: No context handler available');
      return;
    }
    
    if (typeof contextHandler !== 'function') {
      console.error('ClassBasedTabsTrigger: Context handler not a function', typeof contextHandler);
      return;
    }
    
    try {
      console.log('ClassBasedTabsTrigger: Calling context handler with:', this.props.value);
      contextHandler(this.props.value);
    } catch (error) {
      console.error('ClassBasedTabsTrigger: Handler execution failed:', error);
    }
  }

  render(): JSX.Element {
    const isActive = this.context?.value === this.props.value;

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1',
          isActive && 'bg-background text-foreground shadow',
          this.props.className
        )}
        onClick={this.handleClick}  // This is guaranteed to be a bound function
        disabled={this.props.disabled}
        type="button"
      >
        {this.props.children}
      </button>
    );
  }
}

/**
 * Class-based tabs content
 */
export class ClassBasedTabsContent extends React.Component<ClassBasedTabsContentProps> {
  static contextType = ClassBasedTabsContext;
  context!: React.ContextType<typeof ClassBasedTabsContext>;

  constructor(props: ClassBasedTabsContentProps) {
    super(props);
    console.log('ClassBasedTabsContent: Constructor completed for value:', props.value);
  }

  render(): JSX.Element {
    if (!this.context || this.context.value !== this.props.value) {
      return null;
    }

    return (
      <div className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        this.props.className
      )}>
        {this.props.children}
      </div>
    );
  }
}
