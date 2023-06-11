import { Status } from '../types';

export class AppError extends Error {
   status: Status;
   isOperational: boolean;
   constructor(public statusCode: number = 500, public message: string) {
      super(message);
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
   }
}
