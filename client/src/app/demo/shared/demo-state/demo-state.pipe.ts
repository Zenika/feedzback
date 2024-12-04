import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ofTypeBoolean',
  pure: false,
})
export class OfTypeBooleanPipe implements PipeTransform {
  transform(values: unknown[]): boolean {
    return values.every((value) => typeof value === 'boolean');
  }
}

@Pipe({
  name: 'stateValue',
})
export class StateValuePipe implements PipeTransform {
  transform(value: unknown): string {
    if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]') {
      return JSON.stringify(value, undefined, 1);
    }
    return String(value);
  }
}
