import { NextFunction, Request, Response } from "express";
import GetChatbotConversationsUseCase from "./GetChatbotConversationsUseCase";

export default class GetChatbotConversationsController {
  constructor(
    private getChatbotConversationsUseCase: GetChatbotConversationsUseCase,
  ) {
    this.getChatbotConversationsUseCase = getChatbotConversationsUseCase;
  }

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId } = request.query;

      if (typeof userId === "string") {
        const chatbotConversations =
          await this.getChatbotConversationsUseCase.execute(userId);
        return response.status(200).json(chatbotConversations);
      } else {
        return response.status(400).json({ message: "UserId inválido" });
      }
    } catch (error) {
      console.error([__filename], { error });
      return next(error);
    }
  }
}
