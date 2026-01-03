import { Request, Response, NextFunction } from "express";
import { settings } from "../config/env";

 // Allows explicitly configured origins from settings
function isAllowedOrigin(origin: string): boolean {
  if (origin.endsWith(settings.DOMAIN_ENDPOINT)) return true;

  return settings.Allowed_ORIGINS.includes(origin);
}

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  // Standard CORS headers
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight requests explicitly
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
