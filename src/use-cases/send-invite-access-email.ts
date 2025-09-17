import { resolve } from 'path'
import { createMailer } from '@/lib/nodemailer'

interface SendInviteAccessEmailUseCaseRequest {
  name: string
  email: string
  token: string
}

export class SendInviteAccessEmailUseCase {
  constructor() { }

  async execute({
    name,
    email,
    token
  }: SendInviteAccessEmailUseCaseRequest) {
    const templatePath = resolve(
      __dirname,
      "..",
      "views",
      "emails",
      "create-new-password.hbs"
    );

    const variables = {
      name: name,
      link: `http://localhost:3000/create-password?token=${token}`
    };

    const mailer = await createMailer()

    await mailer.sendMail(
      email,
      'Criação de senha',
      variables,
      templatePath
    )
  }
}
