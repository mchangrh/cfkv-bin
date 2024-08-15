// const
export const API_DOCS = {
  "version": 1,
  "/b/:binID/:?filename.ext/:?method": {
    "methods": {
      "POST/PUT": {
        "description": "Update contents of a bin",
        "request": "File in body as binary",
        "response": "Nothing (Status Code 200)"
      },
      "GET": {
        "description": "Get contents of a bin",
        "response": "Contents of bin"
      },
      "DELETE": {
        "description": "Delete a bin",
        "response": "Nothing (Status Code 200)"
      },
      "DOWNLOAD": {
        "description": "Download a bin (only in path)",
        "response": "Contents of bin (prompt download)"
      }
    },
    "Headers": {
      "Content-Type": "Content type of the body",
      "File-Name": "Name of the file"
    },
    ":?filename.ext": "Name of the file (optional), can force filename in /download",
    ":?method": "see methods"
  },
  "/b": {
    "methods": {
      "POST/PUT": {
        "description": "Create a new bin",
        "request": "File in body as binary",
        "response": "binID"
      }
    }
  },
  "/c": {
    "methods": {
      "PUT": {
        "description": "Create a new bin with curl -T/ --upload-file syntax",
        "response": "https://host/:binID/:filename.ext"
      }
    },
  },
  "/u/:binID/:?method": {
    "description": "see /b/:binID",
  },
  "/u": {
    "methods": {
      "POST/PUT": {
        "description": "Create a new bin",
        "request": "url body as raw text or searchParam url",
        "response": "binID"
      }
    }
  },
  "/": "/api",
  "/ping": "pong",
  "/upload": "mchangrh.github.io/cfkv-bin",
  "/editor": "mchangrh.github.io/cfkv-bin/editor",
  "/version": "short git commit id",
  "/github": "https://github.com/mchangrh/cfkv-bin",
  "/api": "this",
}
export const SYMBOLS = '23456789abcdefhjkprstxyzABCDEFGHJKMNPQRSTXYZ'
export const MAX_BIN_SIZE = 250000000 // 25MB
export const MAX_EXPIRY = 86400*3 // 3 days
export const methods = ["get", "post", "put", "delete"]

// response helpers
export const stdheaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, File-Name, X-Requested-With",
  "Cache-Control": "no-store,max-age=0,no-cache,must-revalidate,proxy-revalidate",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

export const genID = (len = 5) => {
  let result = ''
  for (let i = 0; i < len; i++) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return result
}