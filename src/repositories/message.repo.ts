import { db } from "../db";
import { messages } from "../db/schema";
import { eq, asc } from "drizzle-orm";

export const MessageRepository = {
  async createMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
  ) {
    const result = await db
      .insert(messages)
      .values({ conversationId, sender, text })
      .returning();

    return result[0];
  },

  async getConversationMessages(conversationId: string, limit = 10) {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(limit);
  },
};
