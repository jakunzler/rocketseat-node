import { NextFunction, Request, Response } from "express";
import DeleteChatbotConversationUseCase from "./DeleteChatbotConversationUseCase";

export default class DeleteChatbotConversationController {
  constructor(
    private deleteChatbotConversationUseCase: DeleteChatbotConversationUseCase,
  ) {
    this.deleteChatbotConversationUseCase = deleteChatbotConversationUseCase;
  }

  async handle(request: Request, response: Response, next: NextFunction) {
    const { chatbotConversationId } = request.params;

    try {
      const result = await this.deleteChatbotConversationUseCase.execute(
        chatbotConversationId,
      );
      return response.status(200).json({ message: result });
    } catch (error) {
      console.error([__filename], { error });
      return next(error);
    }
  }
}
