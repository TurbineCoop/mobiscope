import pointInPolygon from 'point-in-polygon'

function pointsInside(points, polygons) {
  const res = points.map((point) => {
    Object.keys(polygons).forEach((poly) => {
      if (point.isAccessible) return
      let loc = []
      if (Array.isArray(point.location)) loc = point.location
      else loc = [point.lieuTravail.latitude, point.lieuTravail.longitude]

      point.isAccessible = pointInPolygon(loc, polygons[poly]) || false
    })

    return point
  })
  return res
}

async function getIsochronous(home, isoterms) {
  let url = `https://api.ppp38v2.cityway.fr/journeyplanner/api/v3/Isochrones?From=${home}&Intersection=1&user_key=${process.env.CITYWAY_TOKEN}`

  Object.keys(isoterms).forEach((t) => (url += `&${t}=${isoterms[t]}`))

  try {
    const res = await $fetch(url)

    return res.Isochrones[0].Geometry.replace('MULTI', '')
      .replace('POLYGON ', '')
      .split('),')
      .map((x) => x.replace(/[\n/()+]/g, ''))
      .map((x) => {
        return x.split(', ').map((y) => {
          const loc = y.split(' ')
          if (loc.length === 3) loc.shift() // shift in case of empty case
          // reverse lng-lat back to lat-lng
          // parseFloat to anticipate the pointInPolygon endpoint

          return [parseFloat(loc[1]), parseFloat(loc[0])]
        })
      })
  } catch (e) {
    return e
  }
}

export { pointsInside, getIsochronous }
