import { API_DOCS, stdheaders, methods } from './consts'
import { parseBody, parseBodyText, typeResponse, textResponse, redirectResponse, bodyError } from './responseHelpers'
import bin from './binStorage'
import url from './urlStorage'
import { binType, ID } from './types'

const handleBins = async (request: Request, pathname: string, type: binType) => {
  const cfkv = (type === 'bin') ? bin : url
  let method = request.method.toLowerCase()
  const pathSplit = pathname.split("/")
  const binName = pathSplit[2] ?? ''
  // create bin
  if (binName.length == 0) {
    if (method === 'post' || method === 'put') return createBin(request, type)
    else return new Response('see /api', { status: 405 })
  }
  // set method from parameter
  if (methods.includes(pathSplit[3])) method = pathSplit[3]
  // get bin
  if (method === 'get') return await cfkv.get(binName, pathSplit[3])
  // delete bin
  else if (method === 'delete') return await cfkv.delete(binName)
  // update bin
  else if (method === 'post' || method === 'put') return setBin(request, type, binName)
  else return new Response('see /api', { status: 405 })
}

const createBin = async (request: Request, type: binType) => {
  if (type === "bin") {
    const {body, contentType, filename} = await parseBody(request)
    return await bin.create(body, contentType, filename)
  } else {
    const body = await parseBodyText(request)
    return await url.create(body)
  }
}

const setBin = async (request: Request, contentType: string, binName: ID) => {
  if (contentType === "bin") {
    const { body, contentType, filename } = await parseBody(request)
    const err = await bin.set(binName, body, contentType, filename)
    return (err) ? bodyError(err) : textResponse(`set with contentType: ${contentType}`)
  } else {
    const body = await parseBodyText(request)
    const err = await url.set(binName, body)
    return (err) ? bodyError(err) : textResponse(`set to ${body}`)
  }
}

// Process all requests to the worker
const handleRequest = async (request: Request) => {
  const { pathname } = new URL(request.url)
  // handle type in path
  const type = pathname.startsWith('/u') ? 'url'
    : pathname.startsWith('/b') ? 'bin'
    : null
  // handle preflight
  if (request.method === 'OPTIONS') return new Response(null, { headers: { ...stdheaders }})
  // static endpoints
  else if (pathname === '/') return redirectResponse('https://github.com/mchangrh/cfkv-bin#readme')
  else if (pathname === '/api') return typeResponse(JSON.stringify(API_DOCS, null, 4), 'application/json', 'api.json')
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