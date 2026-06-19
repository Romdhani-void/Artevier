import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Error:', error.status, error.message);
    } else {
      console.error('Application Error:', error);
    }
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return error.error?.message || error.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
