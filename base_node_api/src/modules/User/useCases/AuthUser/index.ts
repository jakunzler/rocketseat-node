import { getPrisma } from "../../../../db/prisma";
import AuthUserController from "./AuthUserController";
import AuthUserUseCase from "./AuthUserUseCase";
import SessionRepository from "../../../../modules/User/repositories/SessionRepository";
import UserRepository from "../../../../modules/User/repositories/UserRepository";
import PermissionsRepository from "../../repositories/PermissionRepository";

export default async function AuthUser() {
  const prisma = await getPrisma();

  const authUserRepository = new UserRepository(prisma);
  const sessionRepository = new SessionRepository(prisma);
  const permissionsRepository = new PermissionsRepository(prisma);

  const authUserUseCase = new AuthUserUseCase(
    authUserRepository,
    sessionRepository,
    permissionsRepository,
  );

  const authUserController = new AuthUserController(authUserUseCase);

  return { authUserUseCase, authUserController };
}
