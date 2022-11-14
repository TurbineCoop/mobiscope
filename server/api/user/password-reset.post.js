import { defineHandler } from 'h3'
import { hash } from 'argon2'
import prisma from '../../../prisma/client'

export default defineHandler(async (req) => {
  const { token, password } = await useBody(req)

  const user = await prisma.user.findUnique({ where: { resetToken: token } })
  if (!user && !user.resetToken && user.resetToken !== token) {
    return false
  }

  try {
    await prisma.user.update({
      where: { resetToken: token },
      data: { resetToken: '', password: await hash(password) },
    })

    await prisma.$disconnect()
    return true
  } catch (err) {
    await prisma.$disconnect()
    return false
  }
})
