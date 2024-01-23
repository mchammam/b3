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

  event.respondWith(cachedfetch(event.request))
})

/**
 * Method used to respond with cached data when fetch fails.
 *
 * @param {Request} request - The request object.
 * @returns {Response | Promise<Response | undefined>} The response object.
 */
async function cachedfetch (request) {
  try {
    const res = await fetch(request)

    // Unchachable resource
    if (request.method === 'HEAD') {
      return res
    }

    const cache = await caches.open(version)
    cache.put(request, res.clone())

    return res
  } catch {
    // console.info('ServiceWorker: Serving cached result')
    return caches.match(request)
  }
}
