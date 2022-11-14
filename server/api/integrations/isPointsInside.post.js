import { pointsInside } from './tools'

export default defineEventHandler(async (event) => {
  const { points, polygons } = await useBody(event)

  return pointsInside(points, polygons)
})
