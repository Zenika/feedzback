/**
 * Applies to the `ValidationError` for an array of strings form field:
 *  - `allowedEmailDomainsValidatorFactory`
 *  - `multipleEmailsValidatorFactory`
 *  - `forbiddenValuesValidatorFactory`
 */
export interface StringArrayError {
  /**
   * Value of the form field for which the validation error was raised.
   */
  fieldValues: string[];
}
