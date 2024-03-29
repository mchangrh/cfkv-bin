import { stdheaders } from './consts'

export const typeResponse = (obj: ArrayBuffer | string, type: string, filename: string, download?: boolean) =>
  new Response(obj, { headers: {
    'Content-Type': type,
    'Content-Disposition': `${download ? "attachment" : "inline"}; filename="${filename}"`,
    ...stdheaders }
  })
export const textResponse = (text: string) => typeResponse(text, 'text/plain', '')
export const bodyError = (msg: string) => new Response(msg, { status: 400, headers: { ...stdheaders }})
export const redirectResponse = (url: string) => new Response(null, { status: 301, headers: { 'Location': url }})
export const urlRedirect = (url: string) => new Response(null, { status: 302, headers: { 'Location': url }})

export const parseBody = async(request: Request) => { // parse body
  return ({
    body: await request.arrayBuffer(),
    contentType: request.headers.get('Content-Type'),
    filename: request.headers.get('File-Name'),
    expiry: request.headers.get('Expiry')
  })
}

export const parseBodyText = async(request: Request) => // parse body
  new TextDecoder('utf-8')
    .decode(await request.arrayBuffer())