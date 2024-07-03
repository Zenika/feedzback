export type DemoPropConfig<T> = Partial<{
  defaultValue: T;
}>;

export type DemoProp<T> = {
  (): T;
  set(value: T): void;
  next(): void;
  values: T[];
  config: DemoPropConfig<T>;
};

export type DemoState<T> = Record<keyof T, DemoProp<T[keyof T]>>;
