import { Response } from "express";

export type SSEEventType = "open" | "message" | "done" | "error" | "ping";

export interface SSEEventData {
  event: SSEEventType;
  data: any;
  response: Response;
  id?: string;
}

//Format: event: <type>\ndata: <content>\n\n

export const SSEEvent = ({ event, data, response, id }: SSEEventData): boolean => {
  try {
    let message = "";

    if (event) {
      message += `event: ${event}\n`;
    }

    if (id) {
      message += `id: ${id}\n`;
    }

    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    
    // Handle multi-line data properly
    const dataLines = dataString.split("\n");
    for (const line of dataLines) {
      message += `data: ${line}\n`;
    }

    // End with double newline 
    message += "\n";

    // Write and return success status
    return response.write(message);
  } catch (error) {
    console.error("Failed to send SSE event:", error);
    return false;
  }
};