import { defineEventHandler } from 'h3'
import { getIsochronous } from './tools'

export default defineEventHandler(async (event) => {
  const { home, isoterms } = await useBody(event)

  return await getIsochronous(home, isoterms)
})
