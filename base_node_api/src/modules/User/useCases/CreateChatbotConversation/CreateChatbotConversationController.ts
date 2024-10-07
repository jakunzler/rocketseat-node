import { NextFunction, Request, Response } from "express";
import { CreateChatbotConversationDTO } from "./CreateChatbotConversationDTO";
import CreateChatbotConversationUseCase from "./CreateChatbotConversationUseCase";

export default class CreateChatbotConversationController {
  constructor(
    private createChatbotConversationUseCase: CreateChatbotConversationUseCase,
  ) {
    this.createChatbotConversationUseCase = createChatbotConversationUseCase;
  }

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { title, content, model, provider, user, userId } =
        request.body as CreateChatbotConversationDTO;
      //TODO: Adicionar validação de dados

      const chatbotConversation =
        await this.createChatbotConversationUseCase.execute({
          title,
          content,
          model,
          provider,
          user,
          userId,
        });

      return response.status(200).json({ data: chatbotConversation });
    } catch (error) {
      console.error([__filename], { error });
      return next(error);
    }
  }
}
