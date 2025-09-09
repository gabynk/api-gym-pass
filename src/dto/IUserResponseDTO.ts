export interface IUserResponseDTO {
  id: string
  name: string
  email: string
  created_at: Date
  email_verified_at: Date | null
}