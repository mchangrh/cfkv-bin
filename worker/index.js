
const genID = (len = 5) => {
  let result = ''
  for (let i = 0; i < len; i++) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return result
}

const handleBins = async (request, pathname, type) => {
  const cfkv = (type === 'bin') ? bin : url
  let method = request.method.toLowerCase()
  const pathSplit = pathname.split("/")
  const binName = pathSplit[2] ?? ''
  // create bin
  if (binName.binLength == 0) {
    if (method === 'post' || method === 'put') return createBin(request, type)
    else return new Response('see /api', { status: 405 })
  }
  if (pathSplit[3] ?? '') method = pathSplit[3]
  // get bin
  if (method === 'get') return await cfkv.get(binName)
  // delete bin
  else if (method === 'delete') return await cfkv.delete(binName)
  // update bin
  else if (method === 'post' || method === 'put') return setBin(request, type, binName)
  else return new Response('see /api', { status: 405 })
}

const createBin = async (request, type) => {
  if (type === "bin") {
    const {body, type, filename} = await parseBody(request)
    return await bin.create(body, type, filename)
  } else {
    const body = await parseBodyText(request)
    return await url.create(body)
  }
}

const setBin = async (request, type, binName) => {
  if (type === "bin") {
    const { body, type, filename } = await parseBody(request)
    const err = await bin.set(binName, body, filename)
    return (err) ? bodyError(err) : textResponse(`set with type: ${type}`)
  } else {
    const body = await parseBodyText(request)
    const err = await url.set(binName, body)
    return (err) ? bodyError(err) : textResponse(`set to ${body}`)
  }
}

// Process all requests to the worker
const handleRequest = async (request) => {
  const { pathname } = new URL(request.url)
  // handle type in path
  const type = pathname.startsWith('/u') ? 'url'
    : pathname.startsWith('/b') ? 'bin'
    : null
  // handle preflight
  if (request.method === 'OPTIONS') return new Response(null, { headers: { ...stdheaders }})
  // static endpoints
  else if (pathname === '/') return redirectResponse('https://github.com/mchangrh/cfkv-bin#readme')
  else if (pathname === '/api') return typeResponse(JSON.stringify(API_DOCS, null, 4), 'application/json')
  else if (pathname === '/ping') return textResponse('pong') 
  else if (pathname === '/version') return textResponse(VERSION.substring(0,7))
  else if (pathname === '/upload') return redirectResponse('https://mchangrh.github.io/cfkv-bin/')
  // send type to handlers
  else if (type) return handleBins(request, pathname, type)
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