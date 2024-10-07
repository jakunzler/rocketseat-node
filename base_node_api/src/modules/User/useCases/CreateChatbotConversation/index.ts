import { getPrisma } from "../../../../db/prisma";
import ChatbotConversationRepository from "../../repositories/ChatbotConversationRepository";
import CreateChatbotConversationController from "./CreateChatbotConversationController";
import CreateChatbotConversationUseCase from "./CreateChatbotConversationUseCase";

export default async function CreateChatbotConversation() {
  const prisma = await getPrisma();

  const chatbotConversationRepository = new ChatbotConversationRepository(
    prisma,
  );

  const createChatbotConversationUseCase = new CreateChatbotConversationUseCase(
    chatbotConversationRepository,
  );
  const createChatbotConversationController =
    new CreateChatbotConversationController(createChatbotConversationUseCase);

  return {
    createChatbotConversationUseCase,
    createChatbotConversationController,
  };
}
