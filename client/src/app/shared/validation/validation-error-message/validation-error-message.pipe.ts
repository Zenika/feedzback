import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { getValidationErrorMessage } from './validation-error-message';

@Pipe({
  pure: false,
  name: 'validationErrorMessage',
})
export class ValidationErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string | null {
    return getValidationErrorMessage(errors);
  }
}
