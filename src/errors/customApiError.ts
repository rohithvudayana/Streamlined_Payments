interface CustomApiError {
    message: string;
    statusCode: number;
}
  
function createCustomApiError(message: string, statusCode: number): CustomApiError {
    return { message, statusCode };
  }
  
export { createCustomApiError };
  