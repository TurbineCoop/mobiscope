import prisma from '../../../prisma/client'

export default defineEventHandler(async (req) => {
  const body = await useBody(req)

  const benef = await prisma.beneficiary.update({
    where: { id: body.id },
    data: body,
  })
  await prisma.$disconnect()
  return benef
})
