import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { getValidationErrorMessage } from './validation-error-message';

@Pipe({
  name: 'validationErrorMessage',
  standalone: true,
})
export class ValidationErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string | null {
    return getValidationErrorMessage(errors);
  }
}
