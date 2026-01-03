import { Router } from "express";
import { chatStreamController } from "../controllers/chat.controller";
import { settings } from "../config/env";

export const chatRouter = Router();

// chatRouter.use(AuthMiddleWare)

chatRouter.options("/stream", (req, res) => {
  const origin = req.headers.origin;

  if (origin && settings.Allowed_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return res.sendStatus(204);
});

chatRouter.get("/stream", chatStreamController);
