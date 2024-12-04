import { InjectionToken, ValueProvider } from '@angular/core';

export const TIMELINE_BREAKPOINT = new InjectionToken<string>('TIMELINE_BREAKPOINT');

export const provideTimelineBreakpoint = (useValue: string): ValueProvider => ({
  provide: TIMELINE_BREAKPOINT,
  useValue,
});
