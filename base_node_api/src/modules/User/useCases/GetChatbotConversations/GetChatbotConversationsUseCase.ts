import { IChatbotConversationRepository } from "../../../../modules/User/repositories/interfaces/IChatbotConversationRepository";

export default class GetChatbotConversationsUseCase {
  private chatbotConversationRepository: IChatbotConversationRepository;

  constructor(chatbotConversationRepository: IChatbotConversationRepository) {
    this.chatbotConversationRepository = chatbotConversationRepository;
  }

  async execute(userId: string) {
    return this.chatbotConversationRepository.getByUserId(userId);
  }
}
