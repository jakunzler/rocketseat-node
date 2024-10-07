import { getPrisma } from "../../../../db/prisma";
import ChatbotConversationRepository from "../../../../modules/User/repositories/ChatbotConversationRepository";
import GetChatbotConversationsController from "./GetChatbotConversationsController";
import GetChatbotConversationsUseCase from "./GetChatbotConversationsUseCase";

export default async function GetChatbotConversations() {
  const prisma = await getPrisma();

  const chatbotConversationRepository = new ChatbotConversationRepository(
    prisma,
  );

  const getChatbotConversationsUseCase = new GetChatbotConversationsUseCase(
    chatbotConversationRepository,
  );
  const getChatbotConversationsController =
    new GetChatbotConversationsController(getChatbotConversationsUseCase);

  return { getChatbotConversationsUseCase, getChatbotConversationsController };
}
