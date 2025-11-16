import { Response } from 'express';
import { transformDocument, transformArray } from './transform.utils';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
) => {
  // Transform data to match frontend expectations
  let transformedData: any = data;
  
  if (Array.isArray(data)) {
    transformedData = transformArray(data);
  } else if (data && typeof data === 'object') {
    // Check if it's a paginated response
    if ('items' in data && 'total' in data) {
      transformedData = {
        ...data,
        items: transformArray((data as any).items),
      };
    } else {
      transformedData = transformDocument(data);
    }
  }

  const response: ApiResponse<T> = {
    success: true,
    data: transformedData,
  };
  if (message) response.message = message;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};

