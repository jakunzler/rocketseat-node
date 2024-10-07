import { User } from "@prisma/client";

export type CreateChatbotConversationDTO = {
  title?: string;
  content?: string;
  model: string;
  provider: string;
  user: User;
  userId: string;
};
