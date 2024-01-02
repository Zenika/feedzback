import { AbstractControl, ValidationErrors } from '@angular/forms';

export const FORBIDDEN_VALUES_KEY = 'forbiddenValues';

export const forbiddenValuesValidatorFactory =
  (forbiddenValues: string[], caseInsensitive = true) =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value as string | null | undefined)?.trim();
    return value && forbiddenValues.includes(caseInsensitive ? value.toLowerCase() : value)
      ? { forbiddenValues }
      : null;
  };
