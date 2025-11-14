import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(handler: RequestHandler) {
  return function wrapped(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ success: true, data });
}

export function sendError(res: Response, message: string, status = 400) {
  res.status(status).json({ success: false, message });
}

