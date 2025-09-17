import { SendInviteAccessEmailUseCase } from '../send-invite-access-email'

export function MakeSendInviteAccessEmailUseCase() {
  const useCase = new SendInviteAccessEmailUseCase()

  return useCase
}
