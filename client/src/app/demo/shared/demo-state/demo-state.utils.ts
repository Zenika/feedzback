import { signal } from '@angular/core';
import { DemoProp, DemoPropConfig } from './demo-state.types';

export const demoProp = <T>(values: T[], config: DemoPropConfig<T> = {}): DemoProp<T> => {
  let index = 0;

  if (config.defaultValue) {
    index = values.indexOf(config.defaultValue);
  }

  const value = signal<T>(values[index]);

  const prop = function () {
    return value();
  } as DemoProp<T>;

  prop.set = (newValue: T) => {
    index = values.indexOf(newValue);
    value.set(values[index]);
  };

  prop.next = () => {
    index = (index + 1) % values.length;
    value.set(values[index]);
  };

  prop.values = values;

  prop.config = config;

  return prop;
};
