import { IChatbotConversationRepository } from "../../../../modules/User/repositories/interfaces/IChatbotConversationRepository";

export default class DeleteChatbotConversationUseCase {
  private chatbotConversationRepository: IChatbotConversationRepository;

  constructor(chatbotConversationRepository: IChatbotConversationRepository) {
    this.chatbotConversationRepository = chatbotConversationRepository;
  }

  async execute(chatbotConversationId: string) {
    const chatbotConversationToDelete =
      await this.chatbotConversationRepository.getById(chatbotConversationId);

    if (!chatbotConversationToDelete) {
      throw new Error("Mensagem não encontrada");
    }

    await this.chatbotConversationRepository.delete(chatbotConversationId);

    return "Mensagem excluída com sucesso";
  }
}
