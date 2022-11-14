export default defineEventHandler(async (event) => {
  // @ts-ignore
  if (!event.req.user)
    return createError({
      statusCode: 403,
    })

  const body = Object.entries({
    grant_type: 'client_credentials',
    client_id: process.env.POLE_EMPLOI_CLIENT_ID,
    client_secret: process.env.POLE_EMPLOI_CLIENT_SECRET,
    scope: 'api_offresdemploiv2 o2dsoffre api_labonneboitev1',
  })
    .reduce(
      (encoded, [key, value]) => [
        ...encoded,
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      ],
      []
    )
    .join('&')

  try {
    return await $fetch(
      'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        params: {
          realm: '/partenaire',
        },
        body,
      }
    )
  } catch (e: FetchError) {
    return createError(e.response?._data)
  }
})
