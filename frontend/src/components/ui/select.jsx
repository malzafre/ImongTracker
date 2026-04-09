import * as React from 'react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-inner-soft transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';

export { Select };
