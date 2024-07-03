export * from './demo-box';
export * from './demo-state';

import { DemoBoxComponent } from './demo-box';
import { DemoStateComponent } from './demo-state';

export const DemoModule = [DemoBoxComponent, DemoStateComponent] as const;
