import { AbstractControl, ValidationErrors } from '@angular/forms';

// Source: https://github.com/angular/angular/blob/main/packages/forms/src/validators.ts
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const MULTIPLE_EMAILS_SEP = ' ';

export const getMultipleEmails = (input: string | null | undefined, separator = MULTIPLE_EMAILS_SEP): string[] =>
  (input ?? '')
    .split(separator)
    .map((email) => email.trim())
    .filter((email) => email);

export const multipleEmailsValidatorFactory =
  (required = true, emailSeparator = MULTIPLE_EMAILS_SEP) =>
  (control: AbstractControl): ValidationErrors | null => {
    const emails = getMultipleEmails(control.value, emailSeparator);

    const multipleEmails = emails.filter((email) => !EMAIL_REGEXP.test(email)); // List of invalid emails

    const hasErrors = multipleEmails.length || (required && emails.length - multipleEmails.length === 0);

    return hasErrors ? { multipleEmails } : null;
  };
