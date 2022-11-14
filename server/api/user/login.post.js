import { verify } from 'argon2'
import jwt from 'jsonwebtoken'
import prisma from '../../../prisma/client'

export default defineEventHandler(async (event) => {
  const { email, password } = await useBody(event)

  if ([email, password].some((v) => !v || typeof v !== 'string')) {
    return {
      error: 400,
    }
  }

  if (!event.req.user || event.req.user.email !== email) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (!user) {
      return {
        error: 403,
      }
    }
    if (!(await verify(user.password, password))) {
      return {
        error: 403,
      }
    }

    event.req.user = user
  }

  const token = jwt.sign(
    {
      userId: event.req.user.id,
      firstName: event.req.user.firstName,
      lastName: event.req.user.lastName,
      email: event.req.user.email,
    },
    process.env.JWT_SECRET
  )

  /*
  setCookie(event.res, 'authorization', token, {
    httpOnly: true,
  })
  */

  await prisma.$disconnect()
  return {
    id: event.req.user.id,
    firstName: event.req.user.firstName,
    lastName: event.req.user.lastName,
    email: event.req.user.email,
    jwt: token,
  }
})
