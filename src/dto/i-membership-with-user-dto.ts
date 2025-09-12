import { IMembershipDTO } from "./i-membership-dto"
import { IUserDTO } from "./i-user-dto"

export type IMembershipWithUserDTO = IUserDTO & { membershipUser: IMembershipDTO[] }