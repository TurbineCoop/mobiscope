import prisma from '../../../prisma/client'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)

  const user = await prisma.user.update({
    where: { email: event.req.user.email },
    data: {
      beneficiaries: {
        create: [body],
      },
    },
    include: {
      beneficiaries: true,
    },
  })

  await prisma.$disconnect()
  return user.beneficiaries.reverse() || user.beneficiaries
})
