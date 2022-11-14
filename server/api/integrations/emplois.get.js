import { defineHandler, useQuery } from 'h3'
// import romes from '../data/romes.json'

export default defineHandler(async (req) => {
  const { commune, distance, grandDomaine, apiKey } = useQuery(req)

  const res = await $fetch(
    `https://api.emploi-store.fr/partenaire/offresdemploi/v2/offres/search?commune=${commune}&distance=${distance}&grandDomaine=${grandDomaine}`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    }
  )

  return res.resultats || []
})
