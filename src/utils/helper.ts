import { NextFunction, Request, RequestHandler, Response } from "express";

type APIPayload = {
  req: Request;
  res: Response;
  next: NextFunction;
};

export const TryCatch =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

