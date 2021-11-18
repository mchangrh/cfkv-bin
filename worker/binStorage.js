const binGetValue = async (ID) => { 
  const {value, metadata} = await BIN_BIN.getWithMetadata(ID, {type: "arrayBuffer"})
  return (value === null)
    ? new Response(null, { status: 404 })
    : typeResponse(value, metadata.type)
}

const binDeleteValue = async (ID) => {
  await BIN_BIN.delete(ID)
  return new Response(null, { status: 200 })
}

const binSetValue = async (ID, value, type) => {
  const length = value.byteLength
  if (length === 0 ) return "empty body"
  if (length >= MAX_BIN_SIZE) return "body too large"
  // if less than 100b, store for 24hr, else store according to size, down to 1hr
  const expirationTime = (length <= 100)
    ? EXPIRATION
    : Math.max(EXPIRATION*(1-(length/MAX_BIN_SIZE)), 3600)
  await BIN_BIN.put(ID, value, { expirationTtl: expirationTime, metadata: {type: type}})
  return false
}

const binIsValueEmpty = async (ID) => { 
  const value = await binGetValue(ID)
  return value === null
}

const binCreateBin = async (body, type) => {
  let binID = genID() // get random ID
  const currentBin = await binIsValueEmpty(binID) // check if bin is empty
  if (!currentBin) binID = genID()
  const err = await binSetValue(binID, body, type) // put into bin
  return (err) ? bodyError(err) : textResponse(binID)
}