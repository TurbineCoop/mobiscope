import * as wkt from 'terraformer-wkt-parser'

const tripsEndpoint = async (body) => {
  return await $fetch(
    `https://api.ppp38v2.cityway.fr/journeyplanner/api/opt/PlanTrips`,
    { method: 'POST', body }
  )
}

/* const throughCoords = (coords, res) => {
  coords.forEach((c) => {
    if (Array.isArray(c[0])) res = throughCoords(c, res)
    else res.push([c[1], c[0]])
  })
  return res
} */

/* const processGeometry = (links) => {
  let lines = []
  links.forEach((l) => {
    let coords = []
    coords = throughCoords(wkt.parse(l).coordinates, [])
    lines = lines.concat(coords)
  })

  return lines
} */

const processGeometry = (links) => {
  try {
    const parsed = links.map((l) => wkt.parse(l))
    const lines = []
    parsed.forEach((l) => {
      if (l.type === 'LineString')
        lines.push(l.coordinates.map((c) => [c[1], c[0]]))
      else l.coordinates.forEach((c) => lines.push(c.map((s) => [s[1], s[0]])))
    })

    return lines
  } catch (err) {
    console.error(err)
    return []
  }
}

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const { home, point, transportMode, UseSimpleModes } = await useBody(event)

  try {
    const enTracesRefs = {
      pedestrian: { name: 'Walk', options: { Walkspeed: 5 } },
      carOrBike: { name: 'Car' },
      transports: { name: 'Pt', options: { Walkspeed: 5 } },
      carpooling: { name: 'Car' },
      bicycle: { name: 'Bike', options: { BikeSpeed: 15 } },
      elecBicycle: { name: 'Bike', options: { BikeSpeed: 20 } },
      scooter: { name: 'Bike', options: { bikeSpeed: 12 } },
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

    if (!point.traces) point.traces = {}

    const mode = frToEn[point.mobility] || transportMode
    const tripSettings = enTracesRefs[mode]

    const arrival = point.location
      ? point.location
      : [point.lieuTravail.latitude, point.lieuTravail.longitude]

    let raws = await tripsEndpoint({
      Departure: {
        Latitude: home[0],
        Longitude: home[1],
      },
      Arrival: {
        Latitude: arrival[0],
        Longitude: arrival[1],
      },
      Traces: [tripSettings.name],
      Options: tripSettings.options,
      UserId: process.env.CITYWAY_TOKEN,
      UseSimpleModes,
    })

    if (!raws) return point
    // console.log(raws.Data[0].response)
    // console.log(home, arrival)
    if (raws.Data[0].response.Status.Code === 'NO_SOLUTION_FOR_REQUEST') {
      raws = await tripsEndpoint({
        Departure: {
          Latitude: home[0],
          Longitude: home[1],
        },
        Arrival: {
          Latitude: arrival[0],
          Longitude: arrival[1],
        },
        Traces: ['Walk'],
        Options: { WalkSpeed: 5 },
        UserId: process.env.CITYWAY_TOKEN,
        UseSimpleModes,
      })
    }

    for (const trace of raws.Data) {
      const trip = trace.response.trips.Trip[0]
      if (!trip) continue

      point.traces[mode] = {
        type: mode,
        typeRef: trace.PlanTripType,
        departure: {
          cityCode: trip.Departure.Site.CityCode,
          cityName: trip.Departure.Site.CityName,
          name: trip.Departure.Site.Name,
          position: trip.Departure.Site.Position,
          type: trip.Departure.Site.Type,
          time: trip.Departure.Time,
        },
        arrival: {
          cityCode: trip.Arrival.Site.CityCode,
          cityName: trip.Arrival.Site.CityName,
          name: trip.Arrival.Site.Name,
          position: trip.Arrival.Site.Position,
          type: trip.Arrival.Site.Type,
          time: trip.Arrival.Time,
        },
        carbonFootprint: trip.CarbonFootprint,
        disruption: trip.Disruption,
        distance: trip.Distance,
        duration: trip.Duration,
        interChangeNumber: trip.InterChangeNumber,
        pathLines: [],
      }
      point.traces[mode].steps = trip.sections.Section.map((section) => {
        // for each step in journey
        if (section.Leg) {
          const s = section.Leg

          let links = s?.pathLinks?.PathLink.map((p) => {
            return p?.Geometry
          })
          if (links) {
            links = processGeometry(links)
            point.traces[mode].pathLines =
              point.traces[mode].pathLines.concat(links)
          }
          return {
            type: s.TransportMode,
            duration: s.Duration,
            departure: {
              cityCode: s.Departure.Site.CityCode,
              cityName: s.Departure.Site.CityName,
              name: s.Departure.Site.Name,
              position: s.Departure.Site.Position,
              type: s.Departure.Site.Type,
              time: s.Departure.Time,
            },
            arrival: {
              cityCode: s.Arrival.Site.CityCode,
              cityName: s.Arrival.Site.CityName,
              name: s.Arrival.Site.Name,
              position: s.Arrival.Site.Position,
              type: s.Arrival.Site.Type,
              time: s.Arrival.Time,
            },
            links,
          }
        }

        const s = section.PTRide

        let links = s?.TripGeometry
        if (links) {
          links = processGeometry([links])
          point.traces[mode].pathLines =
            point.traces[mode].pathLines.concat(links)
        }

        return {
          type: s.TransportMode,
          code: s.Code,
          Destination: s.Destination,
          Direction: s.Direction,
          Duration: s.Duration,
          arrival: {
            time: s.Arrival.Time,
            cityCode: s.Arrival.StopPlace.CityCode,
            cityName: s.Arrival.StopPlace.CityName,
            name: s.Arrival.StopPlace.Name,
            position: s.Arrival.StopPlace.Position,
            type: s.Arrival.StopPlace.Type,
          },
          departure: {
            time: s.Departure.Time,
            cityCode: s.Departure.StopPlace.CityCode,
            cityName: s.Departure.StopPlace.CityName,
            name: s.Departure.StopPlace.Name,
            position: s.Departure.StopPlace.Position,
            type: s.Departure.StopPlace.Type,
          },
          line: s.Line,
          links,
        }
      })
    }

    return point
  } catch (err) {
    return err
  }
})
