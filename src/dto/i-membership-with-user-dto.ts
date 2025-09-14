import { IMembershipDTO } from "./i-membership-dto"
import { IUserDTO } from "./i-user-dto"

export type IUserWithMembershipDTO = IUserDTO & { membershipUser: IMembershipDTO[] }

export type IMembershipWithUserDTO = IMembershipDTO & { user: IUserDTO }