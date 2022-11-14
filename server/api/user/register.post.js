import { hash } from 'argon2'
import jwt from 'jsonwebtoken'
import prisma from '../../../prisma/client'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return JSON.stringify({
      error: 403,
      message: 'User with this email already exists',
    })
  }

  const passHash = await hash(body.password)

  const user = await prisma.user.create({
    data: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: passHash,
    },
  })

  const token = jwt.sign(
    {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.JWT_SECRET
  )

  await prisma.$disconnect()
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token,
  }
})
