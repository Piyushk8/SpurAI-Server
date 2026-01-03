import { TryCatch } from "../utils/helper";
import * as z from "zod";
import { messageInputSchema } from "./chat.types";
import { ApiError } from "../utils/error";
import { ChatService } from "../services/chat.service";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { SSEEvent } from "../utils/sse";
import { settings } from "../config/env";

// export const chatController = TryCatch(async (req, res) => {
//   const parsed = messageInputSchema.safeParse(req.body);
//   if (!parsed.success) throw new ApiError(400, parsed.error.message);

//   const result = await ChatService.handleUserMessage(
//     parsed.data.message,
//     parsed.data.sessionId
//   );

//   return res.status(200).json({
//     success: true,
//     data: result,
//   });
// });

export const chatStreamController = async (
  req: Request,
  res: Response,
  nex: NextFunction
) => {
  try {
    const message = req.query.message as string;
    const sessionId = req.query.sessionId as string | undefined;
    const parsedBody = messageInputSchema.safeParse({ message, sessionId });
    if (!parsedBody.success) throw new ApiError(400, parsedBody.error.message);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    res.setHeader("X-Accel-Buffering", "no"); // for Nginx
    res.setHeader("Cache-Control", "no-cache, no-transform"); // for CDNs
    res.flushHeaders();

    SSEEvent({ event: "open", data: "opened", response: res });
    const heartbeat = setInterval(() => {
      SSEEvent({ event: "ping", data: "pinged", response: res });
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
    });

    // to make sure there is no Client side disruptions
    let isClientDisconnected = false;

    req.on("close", () => {
      isClientDisconnected = true;
      logger.info("Client Disconnected! Stopping Streaming..");
    });

    const result = await ChatService.handleUserMessage(
      parsedBody.data.message,
      parsedBody.data?.sessionId || "",
      async (token) => {
        if (isClientDisconnected) return;

        SSEEvent({ event: "message", data: token, response: res });
      }
    );
    if (!isClientDisconnected) {
      SSEEvent({
        event: "done",
        data: { sessionId: result.sessionId, fullResponse: result.reply },
        response: res,
      });
      res.end();
    }
  } catch (error) {
    try {
      SSEEvent({ response: res, data: "[error]", event: "error" });
    } catch (_) {}
    res.end();
    logger.error(`[chat]:controller ${(error as Error).message}`);
  }
};
