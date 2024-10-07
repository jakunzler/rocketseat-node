import CreateChatbotConversation from "@/modules/User/useCases/CreateChatbotConversation";
import UpdateChatbotConversation from "@/modules/User/useCases/UpdateChatbotConversation";
import { Router } from "express";
import passport from "passport";

const chatbotRouter = Router({ mergeParams: true });

chatbotRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (request, response, next) => {
    try {
      console.log(request.body);
      const { createChatbotConversationController } =
        await CreateChatbotConversation();
      return createChatbotConversationController.handle(
        request,
        response,
        next,
      );
    } catch (error) {
      return response.status(400).json({ message: "Erro ao criar chatbot" });
    }
  },
);

chatbotRouter.put(
  "/:chatbotConversationId",
  passport.authenticate("jwt", { session: false }),
  async (request, response, next) => {
    try {
      const { updateChatbotConversationController } =
        await UpdateChatbotConversation();
      return updateChatbotConversationController.handle(
        request,
        response,
        next,
      );
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Erro ao atualizar chatbot" });
    }
  },
);

export default chatbotRouter;
