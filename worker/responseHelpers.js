const typeResponse = (obj, type, filename)  =>  new Response(obj,   { headers: { 'Content-Type': type, 'Content-Disposition': `inline; filename = "${filename}"`, ...stdheaders }})
const textResponse = (text)       =>  typeResponse(text,  "text/plain")
const bodyError = (msg)           =>  new Response(msg,   { status: 400, headers: { ...stdheaders }})
const redirectResponse = (url)    =>  new Response(null,  { status: 301, headers: { 'Location': url }})
const urlRedirect = (url)         =>  new Response(null,  { status: 302, headers: { 'Location': url }})

const parseBody = async(request) => { // parse body
  return ({
    body: await request.arrayBuffer(),
    type: request.headers.get('Content-Type'),
    filename: request.headers.get('File-Name'),
  })
}

const parseBodyText = async(request) => // parse body
  new TextDecoder('utf-8')
    .decode(await request.arrayBuffer())