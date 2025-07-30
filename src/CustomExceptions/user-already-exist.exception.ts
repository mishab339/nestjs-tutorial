import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(fieldName: string, fieldValue: string) {
    super(
      `User with this ${fieldName} already exists: ${fieldValue}`,
      HttpStatus.CONFLICT,
    );
  }
}
