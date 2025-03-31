
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error & { status?: number; code?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  // Handle specific PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      message: 'This resource already exists',
    });
  }

  console.error(`[ERROR] ${status}: ${message}`);
  console.error(err.stack);

  res.status(status).json({
    status: 'error',
    message,
  });
};
