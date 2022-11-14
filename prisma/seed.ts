import { hash } from 'argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'a.mayer.devpro@gmail.com' },
    update: {},
    create: {
      email: 'a.mayer.devpro@gmail.com',
      password: await hash('test1234'),
      firstName: 'alexandre',
      lastName: 'mayer',
      beneficiaries: {
        create: [
          {
            firstName: 'Grappu',
            lastName: 'LeRaisin',
            activitySector: 'Extraction de minerais métalliques',
            sectorCode: '4',
          },
          {
            firstName: 'Aurelie',
            lastName: 'Labrutti', // C'est italien tkt
            activitySector: 'Fabrication de boissons',
            sectorCode: '11',
          },
        ],
      },
    },
    include: {
      beneficiaries: true,
    },
  })
}

main()
  .catch((e) => {
    global.console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
