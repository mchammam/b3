const version = '1.0.0'

self.addEventListener('install', async (event) => {
  // console.log(`ServiceWorker: Version ${version} installed`)
})

self.addEventListener('activate', async (event) => {
  // console.log(`ServiceWorker: Version ${version} activated`)

  const cacheKeys = await caches.keys()

  cacheKeys.forEach(key => {
    if (key !== version) {
      // console.info('ServiceWorker: Clearing cache for version', key)
      caches.delete(key)
    }
  })
})

self.addEventListener('fetch', (event) => {
  // console.info('ServiceWorker: Fetch')

  event.respondWith(cachedData(event.request))
})

/**
 * Method used to respond with cached data if found, else fetch the data.
 *
 * @param {Request} request - The request object.
 * @returns {Response | Promise<Response | undefined>} The response object.
 */
async function cachedData (request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  } else {
    return cachedFetch(request)
  }
}

/**
 * Method used to fetch request (and cache it).
 *
 * @param {Request} request - The request object.
 * @returns {Response | Promise<Response | undefined>} The response object.
 */
async function cachedFetch (request) {
  const response = await fetch(request)

  // Unchachable resource
  if (request.method === 'HEAD') {
    return response
  }

  cacheResponse(request, response.clone())

  return response
}

/**
 * Method used to cache response.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
async function cacheResponse (request, response) {
  try {
    const cache = await caches.open(version)
    cache.put(request, response)
  } catch {
    console.error('Cache error')
  }
}
