import { defineHandler } from 'h3'
import prisma from '../../../prisma/client'

export default defineHandler(async (req) => {
  if (!req.user)
    return createError({
      statusCode: 403,
    })

  const { benefId } = useQuery(req)

  const raws = await prisma.point.findMany({
    where: {
      benefId: {
        equals: parseInt(benefId),
      },
    },
  })

  await prisma.$disconnect()
  return raws || []
})
