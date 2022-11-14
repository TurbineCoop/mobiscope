import { defineHandler } from 'h3'
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import prisma from '../../../prisma/client'

const mailgun = new Mailgun(formData)

export default defineHandler(async (req) => {
  const body = await useBody(req)

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
  })
  if (!user) {
    return true
  }

  const urlToken =
    Math.random().toString(36).substring(2, 32) + user.id.toString()

  await prisma.user.update({
    where: { email: body.email.toLowerCase() },
    data: { resetToken: urlToken },
  })

  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_KEY,
    url: 'https://api.eu.mailgun.net',
  })
  mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `Mobiscope <${process.env.MAIL_FROM}>`,
    to: [body.email],
    subject: 'MOBISCOPE : Réinitialisation de votre mot de passe',
    html: `
      <body>
        <section style="background-color:#FFFF; color:black; ">
          <div>
            <h1>Reinitialisez votre mot de passe</h1>
            <p>Reinitialisez votre mot de passe en cliquant sur le lien ci-dessous !</p>
            <a href="${process.env.MAIL_LINK_DOMAIN}/user/password-reset?token=${urlToken}" class="test">${process.env.MAIL_LINK_DOMAIN}/user/password-reset?token=${urlToken}</a>
          </div>
        </section>
        <style>
          section {
            display: flex;
            justify-content: center;
            height: 30%;
            width: 80%;
            margin: auto;
            padding: 3rem;
          }
          button {
            width: 8rem;
          }
        </style>
      </body>
      `,
  })

  await prisma.$disconnect()
  return true
})
