import { defineStore } from 'pinia'

const getEmptyVehicles = () => {
  return {
    transports: false,
    pedestrian: false,
    carOrBike: false,
    carpooling: false,
    bicycle: false,
    elecBicycle: false,
    scooter: false,
  }
}

const frToEn = {
  'A pied': 'pedestrian',
  'En vehicule motorise': 'carOrBike',
  'En bus/car/tram/train': 'transports',
  'En covoiturage': 'carpooling',
  'En velo': 'bicycle',
  'En velo electrique': 'elecBicycle',
  Trottinette: 'scooter',
}

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      offers: [],
      companies: [],
      siaes: [],
      formations: [],
      home: null,
      selected: null,
      apiToken: null,
      distance: 5,
      maxDuration: 0,
      isoToDisplay: '',
      filtersUpdated: false,
      terms: {
        withVehicles: getEmptyVehicles(),
        acceptChanges: true,
      },
      tracesCache: {},
      transportModes: [],
      sectors: {
        'Agriculture / Pêche / Espaces verts et naturels / Soins aux animaux':
          'A',
        'Arts / Artisanat d’art': 'B',
        'Banque / Assurance': 'C',
        Immobilier: 'C15',
        'Commerce / Vente': 'D',
        'Communication / Multimédia': 'E',
        'Bâtiment / Travaux Publics': 'F',
        'Hôtellerie – Restauration / Tourisme / Animation': 'G',
        Industrie: 'H',
        'Installation / Maintenance': 'I',
        Santé: 'J',
        'Services à la personne / à la collectivité': 'K',
        Spectacle: 'L',
        Sport: 'L14',
        'Achats / Comptabilité / Gestion': 'M',
        'Direction d’entreprise': 'M13',
        'Conseil/Etudes': 'M14',
        'Ressources Humaines': 'M15',
        'Secrétariat/Assistanat': 'M16',
        'Marketing /Stratégie commerciale': 'M17',
        'Informatique / Télécommunication': 'M18',
        'Transport / Logistique': 'N',
      },
    }
  },
  actions: {
    async getApiToken() {
      const { access_token: apiKey } = await $fetch(
        '/api/integrations/pole-emploi'
      )

      if (apiKey) this.apiToken = apiKey
    },
    async loadOffers() {
      await this.getApiToken()
      await this.researchLoader()
      // const benef = await useBenefStore()
      return await $fetch(
        `/api/integrations/emplois?commune=${this.terms.inseeCode}&distance=${this.distance}&grandDomaine=${this.terms.activitySector}&apiKey=${this.apiToken}`
      )
      // return await this.processData(offers)
    },
    async loadFormations() {
      await this.researchLoader()
      const loc = this.home.location
      const formations = await $fetch(`/api/integrations/formations`)
      const iso = await $fetch(`/api/integrations/isochronous`, {
        method: 'post',
        body: {
          home: loc[1] + ';' + loc[0],
          isoterms: {
            Type: 1,
            WalkSpeed: 5,
            maxDuration: 240,
          },
        },
      })
      // const unFiltered2 = await pointsInside(formations, iso)
      const unFiltered = await $fetch(`/api/integrations/isPointsInside`, {
        method: 'post',
        body: {
          points: formations,
          polygons: iso,
        },
      })
      const filtered = unFiltered
        .filter((p) => p.isAccessible)
        .map((p) => {
          delete p.isAccessible
          return p
        })
      return filtered

      // return await this.processData(formations)
    },
    async loadSiaes() {
      await this.researchLoader()

      const withoutLocation = await $fetch(
        `/api/integrations/siaes?inseeCode=${this.terms.inseeCode}&distance=${this.distance}`
      )

      return await $fetch(`/api/integrations/siaesLocations`, {
        method: 'post',
        body: { withoutLocation },
      })
      // return await this.processData(siaes)
    },
    async loadCompanies() {
      await this.getApiToken()
      await this.researchLoader()
      return await $fetch(
        `/api/integrations/labonneboite?commune=${
          this.terms.inseeCode
        }&distance=${
          this.distance
        }&sector=${this.terms.activitySectorName.replaceAll(
          /[ ]/g,
          '%20'
        )}&apiKey=${this.apiToken}`
      )
      // return await this.processData(companies)
    },
    async researchLoader() {
      if (!this.apiToken) await this.getApiToken()
      if (!this.apiToken) return

      this.filtersUpdated = false
      this.transportModes = Object.keys(this.terms.withVehicles).filter(
        (k) => this.terms.withVehicles[k]
      )
    },
    async processData(data) {
      const res = data
        .filter((o) => o?.lieuTravail?.latitude || o?.location)
        .map((o) => ({
          ...o,
          ...(o.lieuTravail && {
            location: [o.lieuTravail.latitude, o.lieuTravail.longitude],
          }),
        }))

      const destinations = res.reduce(
        (destinations, el) => ({
          ...destinations,
          [el.location.join()]: {
            location: el.location,
            id: el.location.join(),
          },
        }),
        {}
      )

      await Promise.all(
        Object.values(destinations).map(async (destination) => {
          const tracesPromises = this.transportModes.map((mode) =>
            this.getTraces([destination], this.home, mode, true)
          )
          try {
            destinations[destination.id].traces = (
              await Promise.all(tracesPromises)
            )
              .flat()
              .reduce(
                (allTraces, traceByMode) => ({
                  ...allTraces,
                  ...traceByMode.traces,
                }),
                {}
              )
          } catch (err) {
            console.log('Trace skipped.')
          }
        })
      )

      return res.map((el) => ({
        ...el,
        traces: destinations[el.location.join()].traces || {},
      }))
    },
    async getTraces(points, home, transportMode) {
      if (home) this.home = home

      const pointsWithTraces = await Promise.all(
        (points || []).map((point) =>
          this.tracesCache[
            `${
              transportMode || frToEn[point.mobility]
            }-${this.home.location.join()}-${point.location.join()}`
          ]
            ? Object.assign({}, point, {
                traces: {
                  ...(point.traces || {}),
                  [transportMode || frToEn[point.mobility]]:
                    this.tracesCache[
                      `${
                        transportMode || frToEn[point.mobility]
                      }-${this.home.location.join()}-${point.location.join()}`
                    ],
                },
              })
            : $fetch(`/api/integrations/trips`, {
                method: 'post',
                body: {
                  home: this.home.location,
                  point,
                  transportMode,
                  UseSimpleModes: +!this.terms.acceptChanges,
                },
              })
        )
      )

      Object.assign(
        this.tracesCache,
        pointsWithTraces.reduce((toCache, point) => {
          Object.values(point.traces).forEach((trace) => {
            toCache[
              `${
                transportMode || frToEn[point.mobility]
              }-${this.home.location.join()}-${trace.arrival.position.Lat},${
                trace.arrival.position.Long
              }`
            ] = trace
          })

          return toCache
        }, {})
      )

      return pointsWithTraces
    },
    async isPointInDep(point, home) {
      if (home) this.home = home
      const p = await $fetch(`/api/integrations/trips`, {
        method: 'post',
        body: {
          home: this.home.location,
          point,
          transportMode: 'Walk',
          UseSimpleModes: false,
        },
      })
      return !!Object.values(p.traces).length
    },
    async loadIsochronous(departure, isoterms) {
      return await $fetch(`/api/integrations/isochronous`, {
        method: 'post',
        body: {
          home: departure[1] + ';' + departure[0],
          isoterms,
        },
      })
    },
    async isPointsAvailable(points, polygons) {
      try {
        const res = await $fetch(`/api/integrations/isPointsInside`, {
          method: 'post',
          body: {
            points,
            polygons,
          },
        })
        return res
      } catch (e) {
        return false
      }
    },
    async trip(dep, arr) {
      dep = Object.values(dep)
      arr = Object.values(arr)

      return await $fetch(
        `/api/integrations/trip?departure=${dep.join('-')}&arrival=${arr.join(
          '-'
        )}&fullData=true`
      )
    },
    async loadTraces(point, i, center) {
      const type = point.natureContrat ? 'offers' : 'siaes'
      this[type][i].traces = await this.trip(this.home.location, center)
      return this[type][i]
    },
    async mergePolygons(polygons) {
      try {
        const res = await $fetch(`/api/integrations/mergePolygon`, {
          method: 'POST',
          body: { polygons },
        })
        return res
      } catch (e) {
        return false
      }
    },
    async loadInseeCode(location) {
      const res = await $fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${
          location.lat || location[0]
        }&lon=${location.lng || location[1]}&format=json`
      )
      const communeName =
        res.address.village || res.address.municipality || res.address.city

      this.postalCode = res.address.postcode
      return $fetch(
        `/api/integrations/commune?name=${communeName
          .normalize('NFD')
          .replace(/[\u0300-\u036F]/g, '')}`
      )
    },
    async updateAvailability(layer, iso) {
      let availabilities = []
      this[layer].forEach((p) => {
        availabilities.push({
          location: p.location,
          isAccessible: false,
        })
      })
      availabilities = await this.isPointsAvailable(availabilities, iso)
      for (let i = 0; i < availabilities.length; i++) {
        this[layer][i].isAccessible = availabilities[i].isAccessible
      }
    },
    resetData() {
      ;['offers', 'siaes', 'companies', 'formations'].forEach((e) => {
        this[e] = []
      })
      this.terms = {
        withVehicles: getEmptyVehicles(),
        acceptChanges: true,
      }
    },
    toggleVehicle(opt) {
      this.terms.withVehicles[opt] = !this.terms.withVehicles[opt]
      this.filtersUpdated = true
    },
    resetVehicles() {
      this.terms.withVehicles = getEmptyVehicles()
    },
    getRedictionTrip(trace) {
      const h = this.home
      const ref = {
        pedestrian: `TypeTrip=PlanTrip&ListModes=Walk&Walkspeed=5`,
        carOrBike: `TypeTrip=CarTrip&ListModes=Car&Walkspeed=5`,
        transports: `TypeTrip=PlanTrip&ListModes=Bus%7CCoach%7CMetro%7CTram%7CTod%7CTgv%7CTer%7CTrain%7CPlane&Walkspeed=5`,
        carpooling: `TypeTrip=CarlpoolTrip&ListModes=Car&Walkspeed=5`,
        bicycle: `TypeTrip=BikeTrip&ListModes=Bike&bikeSpeed=5&Walkspeed=15`,
        elecBicycle: `TypeTrip=BikeTrip&ListModes=Bike&bikeSpeed=5&Walkspeed=20`,
        scooter: `TypeTrip=BikeTrip&ListModes=Bike&bikeSpeed=5&Walkspeed=12`,
      }[trace.type]
      return `https://www.itinisere.fr/fr/itineraires/4/JourneyPlanner/result?Algorithm=Fastest&LatDep=${h.location[0]}&LngDep=${h.location[1]}&LatArr=${trace.arrival.position.Lat}&LngArr=${trace.arrival.position.Long}&${ref}`
    },
  },
  getters: {
    offersCount() {
      return this.offers.length
    },
    dataAvailable() {
      return !!(
        this.siaes.length ||
        this.offers.length ||
        this.companies.length ||
        this.formations.length
      )
    },
  },
})
