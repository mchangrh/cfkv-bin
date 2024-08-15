# Temporary *bin & URL Shortener
*bin and URL Shortener with Cloudflare Workers + KV

## Specifics
- 3 * 24hr max TTL
- 25MB max
- assigned `binID` is randomly generated 5 character string
  - exclude commonly mistaken characters (`0oO1LlIi`...)
- `Content-Type` sent is the `Content-Type` returned
- `File-Name` sent is the filename returned

## Hosted
- https://bin.mchang.workers.dev
- [ShareX Config](docs/cfkv-bin.sxcu)
- `curl --upload-file ./filename.txt https://bin.mchang.workers.dev/c/`

## API Docs (also at /api)
```json
{
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
```