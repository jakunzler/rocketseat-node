import { ChatbotConversation } from "@prisma/client";
import { CreateChatbotConversationDTO } from "../../useCases/CreateChatbotConversation/CreateChatbotConversationDTO";

export interface IChatbotConversationRepository {
  create(
    chatbotConversation: CreateChatbotConversationDTO,
  ): Promise<ChatbotConversation>;
  getById(chatbotConversationId: string): Promise<ChatbotConversation | null>;
  getByUserId(userId: string): Promise<ChatbotConversation[] | null>;
  update(
    chatbotConversationId: string,
    updatedChatbotConversationData: Partial<ChatbotConversation>,
  ): Promise<ChatbotConversation>;
  delete(chatbotConversationId: string): Promise<ChatbotConversation>;
}
