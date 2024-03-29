import { genID, MAX_BIN_SIZE, MAX_EXPIRY } from './consts'
import { typeResponse } from './responseHelpers'

type binMetadata = {
  type: string,
  filename: string
}
type contentType = string | null
type filename = string | null | undefined

const binGetValue = async (ID: string, filename?: string, download?: boolean) => {
  const { value, metadata } = await BIN_BIN.getWithMetadata(ID, { type: 'arrayBuffer' })
  const meta = metadata as binMetadata
  return (value === null)
    ? new Response('not found', { status: 404 })
    : typeResponse(value, meta.type, meta.filename ?? filename, download)
}

const binDeleteValue = async (ID: string) => {
  await BIN_BIN.delete(ID)
  return new Response('deleted', { status: 200 })
}

const binSetValue = async (ID: string, value: ArrayBuffer, contentType?: contentType, filename?: filename, expiry?: string|null) => {
  const length = value.byteLength
  if (length === 0 ) return 'empty body'
  if (length >= MAX_BIN_SIZE) return 'body too large'
  // if less than 10k, store for max length, else store according to size, down to 1hr
  const sizeExpiry = (length <= 10000)
    ? MAX_EXPIRY
    : Math.max(MAX_EXPIRY*(1-(length/MAX_BIN_SIZE)), 3600)
  const expirationTime = expiry ? Math.min(sizeExpiry, parseInt(expiry)) : sizeExpiry
  await BIN_BIN.put(ID, value, { expirationTtl: expirationTime, metadata: { type: contentType, filename }})
  return false
}

const binCreateBin = async (body: ArrayBuffer, contentType: contentType, filename?: filename, expiry?: string|null): Promise<{ err: string|false, binID: string }> => {
  let binID = genID() // get random ID
  const currentBin = await binGetValue(binID) // check if bin is empty
  if (currentBin !== null) binID = genID()
  const err = await binSetValue(binID, body, contentType, filename, expiry) // put into bin
  if (filename) binID = `${binID}/${filename}`
  return { err, binID }
}

const bin = {
  get: binGetValue,
  delete: binDeleteValue,
  set: binSetValue,
  create: binCreateBin
}

export default bin