import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordStrength', async: false })
export class PasswordStrengthConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string): boolean {
    // Check length
    if (typeof password == 'string' && password.length < 8) {
      return false;
    }

    const hasSpace = /\s/.test(password);
    if (hasSpace) {
      return false;
    }

    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numericRegex = /\d/;
    const specialCharRegex = /[^a-zA-Z\d]/;

    let categories = 0;
    if (lowercaseRegex.test(password) || uppercaseRegex.test(password)) {
      categories++;
    }
    if (numericRegex.test(password)) {
      categories++;
    }
    if (specialCharRegex.test(password)) {
      categories++;
    }

    return categories >= 3;
  }

  defaultMessage(): string {
    return `weak password, The password must contain at least 8 and contain number,letter and special character. `;
  }
}

export function PasswordStrength(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordStrengthConstraint,
    });
  };
}
