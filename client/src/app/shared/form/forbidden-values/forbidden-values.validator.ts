import { AbstractControl, ValidationErrors } from '@angular/forms';

export const FORBIDDEN_VALUES_KEY = 'forbiddenValues';

export const forbiddenValuesValidatorFactory =
  (forbiddenValues: string[], caseSensitive = false) =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlValue: string[] | string | null | undefined = control.value;

    const values = controlValue ? (Array.isArray(controlValue) ? controlValue : [controlValue]) : [];

    const emailErrors = values.filter((value) =>
      forbiddenValues.includes((caseSensitive ? value : value.toLowerCase()).trim()),
    );

    return emailErrors.length === 0 ? null : { [FORBIDDEN_VALUES_KEY]: emailErrors };
  };
