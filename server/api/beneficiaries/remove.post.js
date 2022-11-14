import { defineHandler } from 'h3'
import prisma from '../../../prisma/client'

export default defineHandler(async (req, res) => {
  const { benefId } = await useBody(req)

  await prisma.beneficiary.delete({
    where: { id: benefId },
  })

  await prisma.$disconnect()
  return res.writeHead(204).end()
})
