import { getPrisma } from "../../../../db/prisma";
import ChatbotConversationRepository from "../../../../modules/User/repositories/ChatbotConversationRepository";
import DeleteChatbotConversationController from "./DeleteChatbotConversationController";
import DeleteChatbotConversationUseCase from "./DeleteChatbotConversationUseCase";

export default async function DeleteChatbotConversation() {
  const prisma = await getPrisma();

  const chatbotConversationRepository = new ChatbotConversationRepository(
    prisma,
  );

  const deleteChatbotConversationUseCase = new DeleteChatbotConversationUseCase(
    chatbotConversationRepository,
  );
  const deleteChatbotConversationController =
    new DeleteChatbotConversationController(deleteChatbotConversationUseCase);

  return {
    deleteChatbotConversationUseCase,
    deleteChatbotConversationController,
  };
}
