import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes";
import { ENV, isProduction } from "./env";
import { attachUser } from "./middleware/auth";
import { sendError } from "./utils/http";

const app = express();

app.use(cors({ origin: ENV.corsOrigin.split(","), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use((req, res, next) => {
  void attachUser(req, res, next);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return sendError(res, err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu", 500);
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

export default app;

