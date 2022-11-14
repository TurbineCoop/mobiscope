import { defineEventHandler } from 'h3'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js'
import Polygon from '@arcgis/core/geometry/Polygon.js'

export default defineEventHandler(async (event) => {
  const { polygons } = await useBody(event)

  const pols = []

  polygons.forEach((multi) => {
    multi.forEach((polygon) => {
      pols.push(
        new Polygon({
          rings: polygon,
          spatialReference: { wkid: 4326 },
        })
      )
    })
  })
  // eslint-disable-next-line import/namespace
  return geometryEngine.union(pols).rings
})
