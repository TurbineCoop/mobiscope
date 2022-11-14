import { defineHandler } from 'h3'
import prisma from '../../../prisma/client'

export default defineHandler(async (req, res) => {
  if (!req.user)
    return createError({
      statusCode: 403,
    })

  const body = await useBody(req)

  await prisma.point.delete({
    where: { id: body.pointId },
  })

  await prisma.$disconnect()
  return res.writeHead(204).end()
})
