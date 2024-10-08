import { getPrisma } from "../../../../db/prisma";
import AddressRepository from "../../../../modules/User/repositories/AddressRepository";
import GetAddressController from "./GetAddressController";
import GetAddressUseCase from "./GetAddressUseCase";

export default async function GetAddress() {
  const prisma = await getPrisma();

  const addressRepository = new AddressRepository(prisma);

  const getAddressUseCase = new GetAddressUseCase(addressRepository);
  const getAddressController = new GetAddressController(getAddressUseCase);

  return { getAddressUseCase, getAddressController };
}
