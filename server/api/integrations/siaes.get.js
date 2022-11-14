import { defineHandler, useQuery } from 'h3'

export default defineHandler(async (req) => {
  const { inseeCode, distance } = useQuery(req)
  const res = await $fetch(
    `https://emplois.inclusion.beta.gouv.fr/api/v1/siaes?code_insee=${inseeCode}&distance_max_km=${
      parseInt(distance) > 100 ? 100 : distance
    }`
  )
  return res?.results || []
})
