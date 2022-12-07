const binGetValue = async (ID) => { 
  const {value, metadata} = await BIN_BIN.getWithMetadata(ID, {type: "arrayBuffer"})
  return (value === null)
    ? new Response(null, { status: 404 })
    : typeResponse(value, metadata.type, metadata.filename)
}

const binDeleteValue = async (ID) => {
  await BIN_BIN.delete(ID)
  return new Response(null, { status: 204 })
}

const binSetValue = async (ID, value, type, filename) => {
  const length = value.byteLength
  if (length === 0 ) return "empty body"
  if (length >= MAX_BIN_SIZE) return "body too large"
  // if less than 1kb, store for max length, else store according to size, down to 1hr
  const expirationTime = (length <= 1000)
    ? MAX_EXPIRY
    : Math.max(MAX_EXPIRY*(1-(length/MAX_BIN_SIZE)), 3600)
  await BIN_BIN.put(ID, value, { expirationTtl: expirationTime, metadata: { type, filename }})
  return false
}

const binCreateBin = async (body, type, filename) => {
  let binID = genID() // get random ID
  const currentBin = await binGetValue(binID) // check if bin is empty
  if (currentBin !== null) binID = genID()
  const err = await binSetValue(binID, body, type, filename) // put into bin
  return (err) ? bodyError(err) : textResponse(binID)
}

const bin = {
  get: binGetValue,
  delete: binDeleteValue,
  set: binSetValue,
  create: binCreateBin
}