
const genID = (len = 5) => {
  let result = ''
  for (let i = 0; i < len; i++) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return result
}

const handleBin = async (request, pathname) => {
  let method = request.method.toLowerCase()
  if ((method === 'post' || method === 'put') && pathname === '/b') {
    const {body, type} = await parseBody(request)
    return await bin.create(body, type)
  }
  const pathSplit = pathname.split("/")
  const binName = pathSplit[2] ?? ''
  if (binName.length == 0 ) return new Response('see /api', { status: 405 })
  if (pathSplit[3] ?? '') method = pathSplit[3]
  // get bin
  if (method === 'get') return await bin.get(binName)
  // delete bin
  else if (method === 'delete') return await bin.delete(binName)
  // update bin
  else if (method === 'post' || method === 'put') {
    const {body, type} = await parseBody(request)
    const err = await bin.set(binName, body)
    return (err) ? bodyError(err) : textResponse(`set with type: ${type}`)
  } else return new Response('see /api', { status: 405 })
}

const handleURL = async (request, pathname) => {
  let method = request.method.toLowerCase()
  if ((method === 'post' || method === 'put') && pathname === '/u') {
    const body = await parseBodyText(request)
    return await url.create(body)
  }
  const pathSplit = pathname.split("/")
  const binName = pathSplit[2] ?? ''
  if (binName.length == 0 ) return new Response('see /api', { status: 405 })
  if (pathSplit[3] ?? '') method = pathSplit[3]
  // get bin
  if (method === 'get') return await url.get(binName)
  // delete bin
  else if (method === 'delete') {
    return await url.delete(binName)
  }
  // update bin
  else if (method === 'post' || method === 'put') {
    const body = await parseBodyText(request)
    const err = await url.set(binName, body)
    return (err) ? bodyError(err) : textResponse(`set to ${body}`)
  } else return new Response('see /api', { status: 405 })
}

// Process all requests to the worker
const handleRequest = async (request) => {
  const { pathname } = new URL(request.url)
  // handle preflight
  if (request.method === 'OPTIONS') return new Response(null, { headers: { ...stdheaders }})
  // static endpoints
  else if (pathname === '/') return redirectResponse('https://github.com/mchangrh/cfkv-bin#readme')
  else if (pathname === '/api') return typeResponse(JSON.stringify(API_DOCS, null, 4), 'application/json')
  else if (pathname === '/ping') return textResponse('pong') 
  else if (pathname === '/version') return textResponse(VERSION.substring(0,7))
  else if (pathname === '/upload') return redirectResponse('https://mchangrh.github.io/cfkv-bin/')
  // send url to handler
  else if (pathname.startsWith('/u')) return await handleURL(request, pathname)
  // send bin to handler
  else if (pathname.startsWith('/b')) return await handleBin(request, pathname)
  // 404
  else return new Response(null, { status: 404 })
}

// Register the worker listener
addEventListener('fetch', event => {
  try {
    return event.respondWith(handleRequest(event.request))
  } catch (err) {
    console.log(err)
    throw err
  }
})