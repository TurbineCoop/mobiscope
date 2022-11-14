import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { withoutLocation } = await useBody(event)
  const res = []
  for (let i = 0; i < withoutLocation.length; i++) {
    const e = withoutLocation[i]
    if (!e.mis_a_jour_le) break
    e.tag = 'siae'
    // get lat long for each siae
    const eq = await $fetch(
      `https://nominatim.openstreetmap.org/search?street=${e.addresse_ligne_1.replaceAll(
        ' ',
        '+'
      )}&city=${e.ville}&format=json`
    )
    if (eq[0]?.lat) {
      e.lieuTravail = {
        latitude: eq[0].lat,
        longitude: eq[0].lon,
      }
      res.push(e)
    }
  }
  return res
})
