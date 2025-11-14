import { Request, Response, NextFunction, RequestHandler } from "express";
export declare function asyncHandler(handler: RequestHandler): (req: Request, res: Response, next: NextFunction) => void;
export declare function sendSuccess<T>(res: Response, data: T, status?: number): void;
export declare function sendError(res: Response, message: string, status?: number): void;
