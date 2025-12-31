import * as z from "zod";

export const messageInputSchema = z.object({
  message: z.string("no a string").min(1).trim(),
  sessionId: z.string().optional().nullable(),
});
