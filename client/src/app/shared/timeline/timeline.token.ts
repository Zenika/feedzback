import { InjectionToken, ValueProvider } from '@angular/core';

export const TIMELINE_BREAKPOINT = new InjectionToken<string>('TIMELINE_BREAKPOINT', {
  factory: () => '768px',
});

export const provideTimelineBreakpoint = (useValue: string): ValueProvider => ({
  provide: TIMELINE_BREAKPOINT,
  useValue,
});
