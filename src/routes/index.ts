import { Router } from "express";
import { chatRouter } from "./chat.route";

export const mainRouter = Router();
mainRouter.use("/chat", chatRouter);
