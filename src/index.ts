import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApiError } from "./utils/error";
import { settings } from "./config/env";
import logger from "./utils/logger";
import { mainRouter } from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"].concat(settings.Allowed_ORIGINS),
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());


app.use("/api/v1", mainRouter);


app.get("/", (_req, res) => {
  return res.send("Support Chat Backend Running");
});



app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`GLOBAL ERROR:", ${err}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({
    error: "Unexpected server error. Please try again.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
