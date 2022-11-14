// eslint-disable-next-line import/default
import Prisma, { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { useCookie } from 'h3'

declare module 'h3' {
  interface IncomingMessage {
    user?: User
  }
}

const prisma = new Prisma.PrismaClient()

export default async function userAuthMiddleware(event) {
  const token = useCookie(event, 'authorization')
  const path = event.req.originalUrl.split('/').slice(-1)[0].split('?')[0]
  if (
    [
      '',
      'trips',
      'favicon.ico',
      'login',
      'register',
      'ask-reset',
      'password-reset',
    ].includes(path)
  )
    // eslint-disable-next-line no-useless-return
    return
  else if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (payload && typeof payload === 'object') {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        })

        await prisma.$disconnect()

        if (!user || user.email !== payload.email) {
          return {
            error: 401,
          }
        }

        event.req.user = {
          id: payload.userId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        }
      }
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e
      }
      return {
        error: 401,
      }
    }
  } else {
    return {
      error: 401,
    }
  }
}
