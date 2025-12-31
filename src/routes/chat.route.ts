import { Router } from "express";
import { chatStreamController } from "../controllers/chat.controller";

export const chatRouter = Router();

// chatRouter.use(AuthMiddleWare)

chatRouter.get("/stream", chatStreamController);
