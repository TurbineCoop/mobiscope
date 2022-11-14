import { defineHandler, useQuery } from 'h3'
import stringSimilarity from 'string-similarity'
// import romes from '../data/romes.json'

export default defineHandler(async (req) => {
  const { commune, distance, sector, apiKey } = useQuery(req)

  const jobs = await $fetch(
    `https://api.emploi-store.fr/partenaire/offresdemploi/v2/referentiel/metiers`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    }
  )

  let bis = ''
  let confidence = 0
  jobs.forEach((r) => {
    const newConf = stringSimilarity.compareTwoStrings(r.libelle, sector)
    if (newConf >= confidence) {
      confidence = newConf
      bis = r
    }
  })

  const res = await $fetch(
    `https://api.emploi-store.fr/partenaire/labonneboite/v1/company?commune_id=${commune}&distance=${distance}&rome_codes=${bis.code}`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    }
  )
  const companies = res.companies
  for (const company of companies) {
    company.location = [company.lat, company.lon]
  }
  return companies
})
