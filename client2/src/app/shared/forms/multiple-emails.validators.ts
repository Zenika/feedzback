import { AbstractControl, ValidationErrors } from '@angular/forms';

export const getEmailPattern = () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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

    const multipleEmails = emails.filter((email) => !getEmailPattern().test(email)); // List of invalid emails

    const hasErrors = multipleEmails.length || (required && emails.length - multipleEmails.length === 0);

    return hasErrors ? { multipleEmails } : null;
  };
