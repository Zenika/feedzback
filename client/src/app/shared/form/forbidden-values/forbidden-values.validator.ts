import { AbstractControl, ValidationErrors } from '@angular/forms';

export const FORBIDDEN_VALUES_KEY = 'forbiddenValues';

export const forbiddenValuesValidatorFactory =
  (forbiddenValues: string[], caseInsensitive = true) =>
  (control: AbstractControl): ValidationErrors | null => {
    const givenValue = control.value;

    const values = givenValue ? (!Array.isArray(givenValue) ? [givenValue] : givenValue) : [];

    const forbiddenResult: string[] = [];

    values.forEach((curValue) => {
      const valueToCompare = caseInsensitive ? curValue.trim().toLowerCase() : curValue;

      if (forbiddenValues.includes(valueToCompare)) {
        forbiddenResult.push(valueToCompare);
      }
    });

    return forbiddenResult.length === 0 ? null : { [FORBIDDEN_VALUES_KEY]: forbiddenResult };
  };
