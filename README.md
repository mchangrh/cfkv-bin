# Temporary *bin
*bin with Cloudflare Workers + KV

An experiement with Cloudflare Workers + KV to create a temporary bin.

## Specifics
- 24hr max TTL
- assigned `binID` is randomly generated 5 character string
  - excluded commonly mistaken characters (`0oO1LlIi`...)
- Whatever `Content-Type` is sent - whatever `Content-Type` is returned

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
  "/b": {
    "methods": {
      "POST": {
        "description": "Create a new bin",
        "response": "binID"
      }
    }
  },
  "/": "github",
  "/ping":"pong",
  "/version": "commit hash",
  "/api": "this"
}
```