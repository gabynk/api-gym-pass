import { User } from "@prisma/client";

export type IUserDTO = Omit<User, 'password_hash'>
