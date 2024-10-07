import { ChatbotConversation, PrismaClient } from "@prisma/client";
import { CreateChatbotConversationDTO } from "../useCases/CreateChatbotConversation/CreateChatbotConversationDTO";
import { IChatbotConversationRepository } from "./interfaces/IChatbotConversationRepository";

export default class ChatbotConversationRepository
  implements IChatbotConversationRepository
{
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create({
    title,
    content,
    model,
    provider,
    userId,
  }: CreateChatbotConversationDTO) {
    return this.prisma.chatbotConversation.create({
      data: {
        title,
        content,
        model,
        provider,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  getById(id: string) {
    return this.prisma.chatbotConversation.findUnique({
      where: {
        id,
      },
    });
  }

  getByUserId(userId: string) {
    return this.prisma.chatbotConversation.findMany({
      where: {
        userId,
      },
    });
  }

  async update(id: string, updatedData: Partial<ChatbotConversation>) {
    if (!Object.keys(updatedData).length) {
      throw new Error("Nenhum dado de atualização fornecido.");
    }

    return this.prisma.chatbotConversation.update({
      where: {
        id,
      },
      data: updatedData,
    });
  }

  delete(id: string) {
    return this.prisma.chatbotConversation.delete({
      where: {
        id,
      },
    });
  }
}
