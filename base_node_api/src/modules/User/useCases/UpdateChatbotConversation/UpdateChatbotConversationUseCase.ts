import { ChatbotConversation } from "@prisma/client";
import { IChatbotConversationRepository } from "../../../../modules/User/repositories/interfaces/IChatbotConversationRepository";
import { assistant } from "@/providers/openai";
import { conversation } from "@/providers/unify";

export default class UpdateChatbotConversationUseCase {
  private chatbotConversationRepository: IChatbotConversationRepository;

  constructor(chatbotConversationRepository: IChatbotConversationRepository) {
    this.chatbotConversationRepository = chatbotConversationRepository;
  }

  async execute(
    chatbotConversationId: string,
    updatedChatbotConversationData: Partial<ChatbotConversation>,
  ) {
    const existingChatbotConversation =
      await this.chatbotConversationRepository.getById(chatbotConversationId);

    if (!existingChatbotConversation) {
      throw new Error("Conversa não encontrada");
    }

    const completion: any = await conversation(
      updatedChatbotConversationData.content || "",
    );

    const chat = {
      user: updatedChatbotConversationData.content,
      completion: completion.assistant.replace(/\【\d+:\d+†source】/g, ""),
    };

    let new_content = JSON.parse(existingChatbotConversation.content || "");
    new_content.push(chat);
    new_content = {
      content: JSON.stringify(new_content),
    };
    console.log(new_content);

    await this.chatbotConversationRepository.update(
      chatbotConversationId,
      new_content,
    );

    return chat.completion;
  }
}
