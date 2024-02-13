import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SentimentNote } from './sentiment.types';

@Component({
  selector: 'app-sentiment',
  host: { '[class]': 'hostCss' },
  standalone: true,
  imports: [MatIconModule],
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

  protected sentimentIcons = [
    'sentiment_extremely_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_neutral',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
  ] as const;

  @Input() note: SentimentNote = undefined;

  @Output() noteChange = new EventEmitter<SentimentNote>();

  protected giveSentiment(note: number | undefined) {
    if (this.disabled) {
      return;
    }
    this.note = this.note === note ? undefined : (note as SentimentNote);
    this.noteChange.emit(this.note);
    this.onChange(this.note);
    this.onTouched();
  }

  protected disabled = false;

  scale = input<1 | 2 | 3>(1);

  get hostCss() {
    return `app-sentiment app-sentiment--scale-${this.scale()}`;
  }

  /* ----- ControlValueAccessor ----- */

  protected onChange: (note: number | undefined) => undefined = () => undefined;

  protected onTouched = (): void => undefined;

  registerOnChange(onChange: (note: number | undefined) => undefined): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(note: SentimentNote): void {
    this.note = note;
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }
}
