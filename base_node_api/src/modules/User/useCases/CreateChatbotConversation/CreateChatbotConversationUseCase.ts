import { IChatbotConversationRepository } from "../../repositories/interfaces/IChatbotConversationRepository";
import { CreateChatbotConversationDTO } from "./CreateChatbotConversationDTO";
import { setContext, assistant } from "@/providers/openai";
import { conversation } from "@/providers/unify";

export default class CreateChatbotConversationUseCase {
  private chatbotConversationRepository: IChatbotConversationRepository;

  constructor(chatbotConversationRepository: IChatbotConversationRepository) {
    this.chatbotConversationRepository = chatbotConversationRepository;
  }

  async execute({
    title,
    content,
    model,
    provider,
    user,
    userId,
  }: CreateChatbotConversationDTO) {
    // await setContext();
    // const completion = await conversation(content);
    const completion: any = await conversation(content || "");

    const chat = JSON.stringify([
      {
        user: content,
        completion: completion.assistant.replace(/\【\d+:\d+†source】/g, ""),
      },
    ]);

    console.log(chat);

    return this.chatbotConversationRepository.create({
      title,
      content: chat || "",
      model,
      provider,
      user,
      userId,
    });
  }
}
