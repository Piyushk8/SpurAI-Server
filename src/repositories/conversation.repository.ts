import { eq } from "drizzle-orm";
import { db } from "../db";
import { conversations } from "../db/schema";

export const conversationRepository = () => ({
  createConversations: async () => {
    const result = await db.insert(conversations).values({}).returning();
    return result[0];
  },

  async getConversation(conversationId: string) {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return result[0] ?? null;
  },
});
