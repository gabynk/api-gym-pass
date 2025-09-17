import { EtherealMail } from "./ethereal-mail"

export async function createMailer() {
  return await EtherealMail.create()
}
