export const STATUS_BY_ERROR_NAME: Record<string, number> = {
  LateCheckInValidationError: 401,
  UserAlreadyExistsError: 400,
  InvalidCredentialsError: 400,
  ResourceNotFoundError: 404,
  UnauthorizedError: 403,
}