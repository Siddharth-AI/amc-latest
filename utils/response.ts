/**
 * Standard API Response Format
 * Consistent response structure for all APIs
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Success response
 */
export function successResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Error response
 */
export function errorResponse(
  message: string,
  error?: string
): ApiResponse {
  return {
    success: false,
    message,
    error,
  };
}

/**
 * Send JSON response
 */
export function sendResponse<T>(
  response: Response,
  status: number,
  message: string,
  data?: T,
  error?: string
) {
  return Response.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
      error,
    },
    { status }
  );
}

