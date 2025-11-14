import { User } from "../../../../../drizzle/schema";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    sessionToken?: string;
  }
}

