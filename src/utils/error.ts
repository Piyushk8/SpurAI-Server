export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number = 500, ...args: any) {
    super(...args);
    this.statusCode = statusCode;
  }
}

