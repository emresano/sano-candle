/// <reference types="cookie-parser" />
import { NextFunction, Request, Response } from "express";
export declare function attachUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
