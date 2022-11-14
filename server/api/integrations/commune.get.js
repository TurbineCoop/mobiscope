import { defineHandler, useQuery } from 'h3'
import communes from '../data/communes.json'

export default defineHandler((req) => {
  const name = useQuery(req).name.toUpperCase()

  return communes.filter((e) => e.name === name)[0].inseeCode
})
