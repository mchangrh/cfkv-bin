// const
const API_DOCS = {
  'version': 0,
  '/b/:binID': { 'methods': {
    'POST': {
      'description': 'Update contents of a bin',
      'response': 'Nothing (Status Code 200)'
    }, 'GET': {
      'description': 'Get contents of a bin',
      'response': 'Contents of bin'
    }, 'DELETE': {
      'description': 'Delete a bin',
      'response': 'Nothing (Status Code 200)'
    }}
  },
  '/b': {
    'methods': { 'POST': {
      'description': 'Create a new bin',
      'response': 'binID'
    }}
  },
  '/': 'github', '/ping': 'pong', '/version': 'commit hash', '/api': 'this'
}
// const EXPIRATION = 24*60*60 // 1 day
// const MAX_BIN_SIZE = 100000 // 100kb
const SYMBOLS = '23456789abcdefhjkprstxyzABCDEFGHJKMNPQRSTXYZ'

// response helpers
const typeResponse = (obj, type) => new Response(obj, {
  headers: { 'Content-Type': type }
})

const textResponse = (text) => new Response(text, { // non cached text response
  headers: {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  }
})

const bodyTooLarge = () => new Response('body too large', { status: 413 })

const redirectResponse = (url) => new Response(null, {
  status: 301, headers: { 'Location': url }
})

const parseBody = async(request) => { // parse body
  const body = await request.arrayBuffer()
  const type = request.headers.get('Content-Type')
  return({body, type})
}


const getValue = async (ID) => { 
  const {value, metadata} = await NAMESPACE.getWithMetadata(ID, {type: "arrayBuffer"})
  return (value === null)
    ? new Response(null, { status: 404 })
    : typeResponse(value, metadata.type)
}
const deleteValue = async (ID) => {
  await NAMESPACE.delete(ID)
  return new Response(null, { status: 200 })
}
const setValue = async (ID, value, type) => {
  const length = value.byteLength
  if (length >= MAX_BIN_SIZE) return false
  // if less than 100b, store for 24hr, else store according to size, down to 1hr
  const expirtaionTime = (length <= 100)
    ? EXPIRATION
    : Math.max(EXPIRATION*(1-(length/MAX_BIN_SIZE)), 3600)
  await NAMESPACE.put(ID, value, { expirationTtl: expirtaionTime, metadata: { type: type }})
  return true
}
const isValueEmpty = async (ID) => { 
  const value = await getValue(ID)
  return value === null
}

const genID = (len = 5) => {
  let result = ''
  for (let i = 0; i < len; i++) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return result
}

const createBin = async (body, type) => {
  let binID = genID() // get random ID
  const currentBin = await isValueEmpty(binID) // check if bin is empty
  if (!currentBin) binID = genID()
  const result = await setValue(binID, body, type) // put into bin
  return (result) ? textResponse(binID) : bodyTooLarge()
}

const handleBin = async (request, pathname) => {
  const method = request.method
  if ((method === 'POST' || method === 'PUT') && pathname === '/b') {
    const {body, type} = await parseBody(request)
    return await createBin(body, type)
  }
  const binName = pathname.substring(3)
  if (binName.length == 0 ) return new Response('see /api', { status: 405 })
  // get bin
  if (method === 'GET') return await getValue(binName)
  // delete bin
  else if (method === 'DELETE') return await deleteValue(binName)
  // update bin
  else if (method === 'POST' || method === 'PUT') {
    const {body, type} = await parseBody(request)
    const result = await setValue(binName, body, type)
    return (result) ? textResponse(`set with type: ${type}`) : bodyTooLarge()
  } else return new Response('see /api', { status: 405 })
}

// Process all requests to the worker
const handleRequest = async (request) => {
  const url = new URL(request.url)
  const pathname = url.pathname
  // send bin to handler
  if (pathname.startsWith('/b')) return await handleBin(request, pathname)
  // static endpoints
  else if (pathname === '/') return redirectResponse('https://github.com/mchangrh/cfkv-bin#readme')
  else if (pathname === '/api') return typeResponse(JSON.stringify(API_DOCS, null, 4), 'application/json')
  else if (pathname === '/ping') return textResponse('pong') 
  else if (pathname === '/version') return textResponse(VERSION.substring(0,7))
  else return new Response(null, { status: 404 })
}

// Register the worker listener
addEventListener('fetch', event => {
  try { return event.respondWith(handleRequest(event.request))
  } catch (err) {
    console.log(err)
    throw err
  }
})