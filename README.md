# Temporary *bin & URL Shortener
*bin and URL Shortener with Cloudflare Workers + KV

## Specifics
- 24hr max TTL
- 10MB max
- assigned `binID` is randomly generated 5 character string
  - exclude commonly mistaken characters (`0oO1LlIi`...)
- `Content-Type` sent is the `Content-Type` returned

## Hosted
- bin.mchang.workers.dev
- [ShareX Config](docs/cfkv-bin.sxcu)

## API Docs (also at /api)
```json
{
  "version": 0,
  "/b/:binID": {
    "methods": {
      "POST": {
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
  "/b/:binID/:method": {
    "description": "Specify method in path instead",
    "methods": "see /b/:binID methods"
  },
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
    "description": "see /b/:binID/:method",
  },
  "/u": {
    "description": "See /b",
  },
  "/": "github",
  "/ping":"pong",
  "/version": "commit hash",
  "/upload": "mchangrh.github.io/cfkv-bin",
  "/api": "this"
}
```