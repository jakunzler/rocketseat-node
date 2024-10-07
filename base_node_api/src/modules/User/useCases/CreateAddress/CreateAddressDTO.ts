import { User } from "@prisma/client";

export type CreateAddressDTO = {
  street: string,
  number: string,
  complement: string,
  sector: string,
  city: string,
  state: string,
  country: string,
  zipCode: string,
  latitude?: number,
  longitude?: number,
  user?: User,
  userId: string,
}