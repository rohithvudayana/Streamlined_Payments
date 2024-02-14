// interface CustomApiError {
//     message: string;
//     statusCode: number;
// }
  
// function createCustomApiError(message: string, statusCode: number): CustomApiError {
//     return { message, statusCode };
//   }
  
// export { createCustomApiError };

export class createCustomApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}