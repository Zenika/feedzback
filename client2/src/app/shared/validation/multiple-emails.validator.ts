import { AbstractControl, ValidationErrors } from '@angular/forms';

// Source: https://github.com/angular/angular/blob/main/packages/forms/src/validators.ts
export const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const MULTIPLE_EMAILS_SEP = ',';

export const MULTIPLE_EMAILS_PLACEHOLDER = `jean.dupont@gmail.com${MULTIPLE_EMAILS_SEP} john.doe@zenika.com`;

/**
 * @example
 * extractEmailFromInput('John Doe <john.doe@gmail.com>') === 'john.doe@gmail.com';
 * extractEmailFromInput('<john.doe@gmail.com>') === 'john.doe@gmail.com';
 * extractEmailFromInput('john.doe@gmail.com') === 'john.doe@gmail.com';
 */
export const extractEmailFromInput = (input: string) => (input.match(/<([^>]+)>/)?.[1] ?? input).trim();

export const getMultipleEmails = (
  input: string[] | string | null | undefined,
  separator = MULTIPLE_EMAILS_SEP,
): string[] => {
  return (Array.isArray(input) ? input : (input ?? '').split(separator))
    .map(extractEmailFromInput)
    .filter((email) => email);
};

export const multipleEmailsValidatorFactory =
  (required = true, emailSeparator = MULTIPLE_EMAILS_SEP) =>
  (control: AbstractControl): ValidationErrors | null => {
    const emails = getMultipleEmails(control.value, emailSeparator);

    const multipleEmails = emails.filter((email) => !EMAIL_REGEXP.test(email)); // List of invalid emails
    if (multipleEmails.length) {
      return { multipleEmails };
    }

    if (required && !emails.length) {
      return { required: true }; // Same return as native Angular `Validators.required` error
    }

    return null;
  };
