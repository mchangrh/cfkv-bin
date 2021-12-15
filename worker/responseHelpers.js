const typeResponse = (obj, type)  =>  new Response(obj,   { headers: { 'Content-Type': type, ...stdheaders }})
const textResponse = (text)       =>  typeResponse(text,  "text/plain")
const bodyError = (msg)           =>  new Response(msg,   { status: 400, headers: { ...stdheaders }})
const redirectResponse = (url)    =>  new Response(null,  { status: 301, headers: { 'Location': url }})
const urlRedirect = (url)         =>  new Response(null,  { status: 302, headers: { 'Location': url }})

const parseBody = async(request) => { // parse body
  return ({
    body: await request.arrayBuffer(),
    type: request.headers.get('Content-Type')
  })
}

const parseBodyText = async(request) => { // parse body
  return new TextDecoder('utf-8')
    .decode(await request.arrayBuffer())
}