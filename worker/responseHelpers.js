const typeResponse = (obj, type) => new Response(obj, {
  headers: {
    'Content-Type': type,
    ...stdheaders
  }
})

const textResponse = (text) => typeResponse(text, "text/plain")

const bodyError = (msg) => new Response(msg, { status: 400, headers: { ...stdheaders }})

const redirectResponse = (url) => new Response(null, {
  status: 301, headers: { 'Location': url }
})

const urlRedirect = (url) => new Response(null, {
  status: 302, headers: { 'Location': url }
})

const parseBody = async(request) => { // parse body
  const body = await request.arrayBuffer()
  const type = request.headers.get('Content-Type')
  return({body, type})
}

const parseBodyText = async(request) => { // parse body
  const bodyBuffer = await request.arrayBuffer()
  const body = new TextDecoder('utf-8').decode(bodyBuffer)
  return body
}