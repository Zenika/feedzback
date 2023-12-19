import { InjectionToken, ValueProvider } from '@angular/core';
import { BreakpointConfig } from './breakpoint.types';

export const BREAKPOINT_CONFIG = new InjectionToken<BreakpointConfig>('BREAKPOINT_CONFIG');

export const provideBreakpointConfig = (config: BreakpointConfig): ValueProvider => ({
  provide: BREAKPOINT_CONFIG,
  useValue: config,
});
