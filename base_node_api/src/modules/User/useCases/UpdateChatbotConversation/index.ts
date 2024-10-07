import { getPrisma } from "../../../../db/prisma";
import ChatbotConversationRepository from "../../../../modules/User/repositories/ChatbotConversationRepository";
import UpdateChatbotConversationController from "./UpdateChatbotConversationController";
import UpdateChatbotConversationUseCase from "./UpdateChatbotConversationUseCase";

export default async function UpdateChatbotConversation() {
  const prisma = await getPrisma();

  const chatbotConversationRepository = new ChatbotConversationRepository(
    prisma,
  );

  const updateChatbotConversationUseCase = new UpdateChatbotConversationUseCase(
    chatbotConversationRepository,
  );
  const updateChatbotConversationController =
    new UpdateChatbotConversationController(updateChatbotConversationUseCase);

  return {
    updateChatbotConversationUseCase,
    updateChatbotConversationController,
  };
}
