import { FormControl, ValidationErrors } from '@angular/forms';

export const addFormControlErrors = (formControl: FormControl, errors: ValidationErrors, emitEvent?: boolean) => {
  formControl.setErrors({ ...formControl.errors, ...errors }, { emitEvent });
};

export const removeFormControlErrors = (formControl: FormControl, errorKeys: string[], emitEvent?: boolean) => {
  const errors = Object.entries(formControl.errors ?? {}).reduce((_errors, [key, value]) => {
    if (!errorKeys.includes(key)) {
      _errors[key] = value;
    }
    return _errors;
  }, {} as ValidationErrors);

  formControl.setErrors(Object.keys(errors).length ? errors : null, { emitEvent });
};
