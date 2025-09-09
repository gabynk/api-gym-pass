import { IUserResponseDTO } from "@/dto/IUserResponseDTO";
import { User } from "@prisma/client";

export class UserResponseMap {
  static toDTO({
    id,
    name,
    email,
    created_at,
    email_verified_at,
  }: User): IUserResponseDTO {
    return {
      id,
      name,
      email,
      created_at,
      email_verified_at,
    }
  }
}