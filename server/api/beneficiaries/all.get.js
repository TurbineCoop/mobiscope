import prisma from '../../../prisma/client'

export default defineEventHandler(async (event) => {
  const user = event.req.user

  if (!event.req.user)
    return createError({
      statusCode: 403,
    })

  const benefs = await prisma.beneficiary.findMany({
    where: { createdBy: user },
    include: { points: true },
  })

  await prisma.$disconnect()
  return benefs.reverse() || benefs
})
