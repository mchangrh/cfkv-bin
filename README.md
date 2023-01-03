# Temporary *bin & URL Shortener
*bin and URL Shortener with Cloudflare Workers + KV

## Specifics
- 24hr max TTL
- 10MB max
- assigned `binID` is randomly generated 5 character string
  - exclude commonly mistaken characters (`0oO1LlIi`...)
- `Content-Type` sent is the `Content-Type` returned

## Hosted
- https://bin.mchang.workers.dev
- [ShareX Config](docs/cfkv-bin.sxcu)

## API Docs (also at /api)
```json
{
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
    }
  },
  "Headers": {
    "Content-Type": "Content type of the body",
    "File-Name": "Name of the file"
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
  "/u/:binID": {
    "description": "see /b/:binID",
  },
  "/u/:binID/:method": {
    "description": "See /b/:binID/:method",
  },
  "/u": {
    "description": "See /b",
  },
  "/": "github",
  "/ping": "pong",
  "/upload": "mchangrh.github.io/cfkv-bin",
  "/api": "this",
}
```