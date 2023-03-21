import { genID, MAX_EXPIRY } from './consts'
import { bodyError, textResponse, urlRedirect } from './responseHelpers'

const urlGetValue = async (ID: string) => { 
  const value = await URL_BIN.get(ID)
  return (value === null)
    ? new Response('not found', { status: 404 })
    : urlRedirect(value)
}

const urlDeleteValue = async (ID: string) => {
  await URL_BIN.delete(ID)
  return new Response('deleted', { status: 200 })
}

const urlSetValue = async (ID: string, value: string) => {
  if (value.length === 0 ) return 'empty body'
  await URL_BIN.put(ID, value, { expirationTtl: MAX_EXPIRY })
  return false
}

const urlCreateBin = async (body: string) => {
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

export default url