/// <reference types="cookie-parser" />
import { Request } from "express";
import { User } from "../../../drizzle/schema";
export interface AuthenticatedRequest extends Request {
    user: User;
    sessionToken: string;
}
