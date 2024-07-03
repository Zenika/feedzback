import { Component, ViewEncapsulation, computed, model, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OfTypeBooleanPipe } from './demo-state.pipe';
import { DemoState } from './demo-state.types';

@Component({
  selector: 'app-demo-state',
  host: { class: 'app-demo-state' },
  standalone: true,
  imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, OfTypeBooleanPipe],
  templateUrl: './demo-state.component.html',
  styleUrls: ['./demo-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoStateComponent<T> {
  state = model.required<DemoState<T>>();

  propChange = output<keyof T>();

  protected props = computed(() => Object.keys(this.state()) as (keyof T)[]);
}
