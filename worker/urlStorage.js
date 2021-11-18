const urlCheckAuth = async (request) => {
  const urlAuthUsers = await AUTH.get("url", { type: "json"})
  const { searchParams } = new URL(request.url)
  const currentUser = searchParams.get("auth")
  return (currentUser && urlAuthUsers.users.includes(currentUser));
}

const urlGetValue = async (ID) => { 
  const value = await URL_BIN.get(ID)
  return (value === null)
    ? new Response(null, { status: 404 })
    : urlRedirect(value)
}

const urlDeleteValue = async (ID) => {
  await URL_BIN.delete(ID)
  return new Response(null, { status: 200 })
}

const urlSetValue = async (ID, value) => {
  const length = value.byteLength
  if (length === 0 ) return "empty body"
  await URL_BIN.put(ID, value, { expirationTtl: EXPIRATION })
  return false
}

const urlIsValueEmpty = async (ID) => { 
  const value = await urlGetValue(ID)
  return value === null
}

const urlCreateBin = async (body) => {
  let binID = genID() // get random ID
  const currentBin = await urlIsValueEmpty(binID) // check if bin is empty
  if (!currentBin) binID = genID()
  const err = await urlSetValue(binID, body) // put into bin
  return (err) ? bodyError(err) : textResponse(binID)
}