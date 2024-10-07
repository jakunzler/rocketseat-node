import { Router } from "express";
import addressRouter from "./address.routes";
import chatbotRouter from "./chatbot.routes";
import phoneRouter from "./phone.routes";
import userRouter from "./user.routes";

const routes = Router();

routes.use("/address", addressRouter);
routes.use("/chatbot", chatbotRouter);
routes.use("/phone", phoneRouter);
routes.use("/user", userRouter);

export default routes;
