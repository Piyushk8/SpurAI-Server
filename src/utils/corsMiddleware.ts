// cors.middleware.ts
import { Request, Response, NextFunction } from "express";
import { settings } from "../config/env";

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const origin = req.headers.origin;

  if (origin && settings.Allowed_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // IMPORTANT: handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
