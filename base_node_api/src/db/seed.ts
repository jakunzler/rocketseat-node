import { PermissionTypeGroup, PrismaClient, Roles } from "@prisma/client";
import argon2id from "argon2";

const prisma = new PrismaClient();

/**
 * Criação do usuário root
 */
const createRootUser = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@email.com",
        password: await argon2id.hash("123456"),
      },
    });
  }
};

createRootUser(prisma);

// Criação de usuários padrão
const createUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const newUsers = [
    {
      name: "User",
      email: "user@email.com",
      password: await argon2id.hash("123456"),
      isActive: true,
    },
  ];

  const nonexistentUsers = newUsers.filter(
    (user) => !users.find((u) => u.email === user.email),
  );

  await prisma.user.createMany({
    data: nonexistentUsers,
  });
};

createUsers(prisma);

// Criação das roles padrão
const createRoles = async (prisma: PrismaClient) => {
  const allRoles = [
    {
      name: "Admin",
      type: PermissionTypeGroup.USER_ADMIN,
      role: Roles.IS_ADMIN,
    },
    {
      name: "Client",
      type: PermissionTypeGroup.USER,
      role: Roles.IS_CLIENT,
    },
    {
      name: "Support",
      type: PermissionTypeGroup.USER_ADMIN,
      role: Roles.IS_SUPPORT,
    },
  ];

  const roles = await prisma.permissionGroups.findMany();

  const nonexistentRoles = allRoles.filter(
    (role) => !roles.find((r) => r.role === role.role),
  );

  if (nonexistentRoles.length > 0) {
    await prisma.permissionGroups.createMany({
      data: nonexistentRoles,
    });
  }
};

createRoles(prisma);

// Atribuição de roles a usuário específico
const assignSpecificRole = async (prisma: PrismaClient) => {
  const user = await prisma.user.findFirst({
    where: {
      email: "user@email.com",
    },
  });

  const permissions = await prisma.permissionGroups.findMany();
  const permission = permissions.find(
    (permission) => permission.role === Roles.IS_CLIENT,
  );

  if (user && permission) {
    await prisma.userPermissionGroups.create({
      data: {
        userId: user.id,
        permissionGroupId: permission.id,
      },
    });
  }
};

assignSpecificRole(prisma);

// Atribuição de roles aos usuários padrão
const assignRoles = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const permissions = await prisma.permissionGroups.findMany();
  const permission = permissions.find(
    (permission) => permission.role === Roles.IS_ADMIN,
  );
  const usersPermissions = await prisma.userPermissionGroups.findMany();
  const nonexistentUserPermissionGroups = users.filter(
    (user) => !usersPermissions.find((p) => p.userId === user.id),
  );

  nonexistentUserPermissionGroups.forEach(async (user) => {
    if (permission) {
      await prisma.userPermissionGroups.create({
        data: {
          userId: user.id,
          permissionGroupId: permission.id,
        },
      });
    }
  });
};

assignRoles(prisma);

// Criação de mensagem padrão
const createMessages = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const messages = await prisma.message.findMany();
  const firstMessage = {
    title: "Bem vindo!",
    content: "Olá, seja bem vindo ao sistema.",
    type: "info",
  };

  const nonexistentUserFirstMessage = users.filter(
    (user) => !messages.find((m) => m.userId === user.id),
  );

  nonexistentUserFirstMessage.forEach(async (user) => {
    const userId = user.id;
    await prisma.message.create({
      data: {
        ...firstMessage,
        userId,
      },
    });
  });
};

createMessages(prisma);

// Criação de endereço para empresa
const createAddress = async (prisma: PrismaClient) => {
  const addresses = await prisma.address.findMany();
  const user = await prisma.user.findFirst(
    {
      where: {
        email: "user@email.com",
      },
    },
  );

  if (user && addresses.length === 0) {
    await prisma.address.create({
      data: {
        street: "AVENIDA Goiás",
        number: "51",
        complement: "Praça do Bandeirante",
        sector: "Setor Central",
        city: "Goiânia",
        state: "Goiás",
        country: "Brasil",
        zipCode: "74005-020",
        userId: user.id,
      },
    });
  }
};

createAddress(prisma);
