import { NextFunction, Request, Response } from "express";
import UpdateChatbotConversationUseCase from "./UpdateChatbotConversationUseCase";

export default class UpdateChatbotConversationController {
  constructor(
    private updateChatbotConversationUseCase: UpdateChatbotConversationUseCase,
  ) {
    this.updateChatbotConversationUseCase = updateChatbotConversationUseCase;
  }

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { chatbotConversationId } = request.params;
      const newData = request.body;

      const chatbotConversation =
        await this.updateChatbotConversationUseCase.execute(
          chatbotConversationId,
          newData,
        );

      return response.status(200).json({ data: chatbotConversation });
    } catch (error) {
      console.error([__filename], { error });
      return next(error);
    }
  }
}
