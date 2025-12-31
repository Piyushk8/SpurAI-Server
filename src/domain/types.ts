//chat types
import * as z from "zod";

const senderEnum = z.enum(["user", "ai"]);

const chatSchema = z.object({
  conversationId: z.string().trim().min(1).nonempty(),
  sender: senderEnum.nonoptional(),
  text: z.string(),
  id: z.string(),
  createdAt: z.date(),
});

export type ChatType = z.infer<typeof chatSchema>;
