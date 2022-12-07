const urlGetValue = async (ID) => { 
  const value = await URL_BIN.get(ID)
  return (value === null)
    ? new Response(null, { status: 404 })
    : urlRedirect(value)
}

const urlDeleteValue = async (ID) => {
  await URL_BIN.delete(ID)
  return new Response(null, { status: 204 })
}

const urlSetValue = async (ID, value) => {
  const length = value.byteLength
  if (length === 0 ) return "empty body"
  await URL_BIN.put(ID, value, { expirationTtl: MAX_EXPIRY })
  return false
}

const urlCreateBin = async (body) => {
  let binID = genID() // get random ID
  const currentBin = await urlGetValue(binID) // check if bin is empty
  if (currentBin !== null) binID = genID()
  const err = await urlSetValue(binID, body) // put into bin
  return (err) ? bodyError(err) : textResponse(binID)
}

const url = {
  get: urlGetValue,
  delete: urlDeleteValue,
  set: urlSetValue,
  create: urlCreateBin
}