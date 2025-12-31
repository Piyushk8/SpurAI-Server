import { ConversationRepository } from "../repositories/conversation.repo";
import { messageRepository } from "../repositories/message.repo";
import logger from "../utils/logger";
import { LLMServices } from "./llm.service";

export const ChatService = {
  handleUserMessage: async (
    message: string,
    sessionId: string | undefined,
    onToken: (chunk: any) => Promise<void>
  ) => {
    try {
      let conversationId =
        sessionId &&
        sessionId !== "null" &&
        sessionId !== "undefined" &&
        sessionId !== ""
          ? sessionId
          : undefined;

      console.log("chat service incoming:", sessionId, typeof sessionId);
      console.log("normalized conversationId:", conversationId);

      if (!conversationId) {
        console.log("Creating conversation...");
        const conversationCreated =
          await ConversationRepository.createConversations();

        if (!conversationCreated)
          throw new Error("Error creating conversation");

        conversationId = conversationCreated.id;
        console.log("Created Conversation:", conversationId);
      }

      console.log("final conversationId:", conversationId);

      const conversation = await ConversationRepository.getConversation(
        conversationId
      );

      if (!conversation) throw new Error("Conversation Not Found.");

      await messageRepository.createMessage(conversationId, "user", message);

      const conversationHistory =
        await messageRepository.getConversationMessages(conversationId, 12);

      console.log("conv History", conversationHistory);

      // Stream AI Reply
      const reply = await LLMServices.streamReply(
        message,
        conversationHistory,
        onToken
      );

      await messageRepository.createMessage(conversationId, "ai", reply);

      return {
        reply,
        sessionId: conversationId,
      };
    } catch (error) {
      // console.log("chat service", error);
      throw new Error("error in processing chat service");
    }
  },
};
