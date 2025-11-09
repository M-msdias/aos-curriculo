export class AppException extends Error {

  constructor(message: string) {
    super(message);
    this.name = 'AppException';

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}