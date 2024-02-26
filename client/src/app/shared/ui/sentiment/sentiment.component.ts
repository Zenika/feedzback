import { Component, ViewEncapsulation, computed, inject, input, model } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SENTIMENTS_ASC } from './sentiment.config';
import { SentimentNote } from './sentiment.types';

@Component({
  selector: 'app-sentiment',
  host: { '[class]': 'hostClass()' },
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SentimentComponent implements ControlValueAccessor {
  private ngControl = inject(NgControl, { optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected sentiments = SENTIMENTS_ASC;

  note = model<SentimentNote>(0);

  protected disabled = false;

  protected touched = false;

  protected giveSentiment(newNote: number) {
    if (this.disabled) {
      return;
    }
    this.note.update((oldNote) => (newNote === oldNote ? 0 : (newNote as SentimentNote)));
    this.onChange(this.note());

    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  hostClass = computed(() => `app-sentiment app-sentiment--size-${this.size()}`);

  /* ----- ControlValueAccessor ----- */

  protected onChange: (note: SentimentNote) => undefined = () => undefined;

  protected onTouched = (): void => undefined;

  registerOnChange(onChange: (note: SentimentNote) => undefined): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(note: SentimentNote): void {
    this.note.set(note);
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }
}
