export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (message: string): ApiResponse<null> => ({
  success: false,
  message,
});

