import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ofTypeBoolean',
  standalone: true,
  pure: false,
})
export class OfTypeBooleanPipe implements PipeTransform {
  transform(values: unknown[]): boolean {
    return values.every((value) => typeof value === 'boolean');
  }
}
