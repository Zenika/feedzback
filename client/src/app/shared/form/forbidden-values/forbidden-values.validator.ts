import { AbstractControl, ValidationErrors } from '@angular/forms';
import { StringArrayError } from '../emails-validation-error.types';

export const FORBIDDEN_VALUES_KEY = 'forbiddenValues';

export const forbiddenValuesValidatorFactory =
  (forbiddenValues: string[], caseSensitive = false) =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlValue: string[] | string | null | undefined = control.value;

    const values = controlValue ? (Array.isArray(controlValue) ? controlValue : [controlValue]) : [];

    const emailErrors = values.filter((value) =>
      forbiddenValues.includes((caseSensitive ? value : value.toLowerCase()).trim()),
    );

    if (emailErrors.length === 0) {
      return null;
    }
    return {
      [FORBIDDEN_VALUES_KEY]: { fieldValues: emailErrors } satisfies StringArrayError,
    };
  };
