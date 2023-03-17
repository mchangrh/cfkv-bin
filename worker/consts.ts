// const
export const API_DOCS = {
  "version": 1,
  "/b/:binID": {
    "methods": {
      "POST/PUT": {
        "description": "Update contents of a bin",
        "response": "Nothing (Status Code 200)"
      },
      "GET": {
        "description": "Get contents of a bin",
        "response": "Contents of bin"
      },
      "DELETE": {
        "description": "Delete a bin",
        "response": "Nothing (Status Code 200)"
      }
    },
    "Headers": {
      "Content-Type": "Content type of the body",
      "File-Name": "Name of the file"
    },
  },
  "/b/:binID/:method": "specify method in path instead",
  "/b": {
    "methods": {
      "POST/PUT": {
        "description": "Create a new bin",
        "response": "binID"
      }
    }
  },
  "/c": {
    "description": "Create a new bin with curl -T/ --upload-file syntax",
    "response": "binID/filename.ext"
  },
  "/u/:binID": {
    "description": "see /b/:binID",
  },
  "/u/:binID/:method": {
    "description": "See /b/:binID/:method",
  },
  "/u": {
    "description": "See /b",
  },
  "/": "api",
  "/ping": "pong",
  "/upload": "mchangrh.github.io/cfkv-bin",
  "/api": "this",
}
export const SYMBOLS = '23456789abcdefhjkprstxyzABCDEFGHJKMNPQRSTXYZ'
export const MAX_BIN_SIZE = 10000000 // 10MB
export const MAX_EXPIRY = 86400*3 // 3 days
export const methods = ["get", "post", "put", "delete"]

// response helpers
export const stdheaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, File-Name",
  "Cache-Control": "no-store,max-age=0,no-cache,must-revalidate,proxy-revalidate",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

export const genID = (len = 5) => {
  let result = ''
  for (let i = 0; i < len; i++) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return result
}