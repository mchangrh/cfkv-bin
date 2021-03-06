// const
const API_DOCS = {
  'version': 0,
  '/b/:binID': { 'methods': {
    'POST/PUT': {
      'description': 'Update contents of a bin',
      'response': 'Nothing (Status Code 200)'
    }, 'GET': {
      'description': 'Get contents of a bin',
      'response': 'Contents of bin'
    }, 'DELETE': {
      'description': 'Delete a bin',
      'response': 'Nothing (Status Code 200)'
    }}
  },
  '/b/:binID/:method': "specify method in path instead",
  '/b': {
    'methods': { 'POST': {
      'description': 'Create a new bin',
      'response': 'binID'
    }}
  },
  '/u/:binID': {
    'description': 'see /b/:binID',
  },
  '/u/:binID/:method': {
    'description': 'See /b/:binID/:method',
  },
  '/u': {
    'description': 'See /b',
  },
  '/': 'github', '/ping': 'pong', '/upload': 'mchangrh.github.io/cfkv-bin', '/api': 'this',
}
const SYMBOLS = '23456789abcdefhjkprstxyzABCDEFGHJKMNPQRSTXYZ'
const MAX_BIN_SIZE = 1000000 // 1MB
const MAX_EXPIRY = 86400 // 24hr

// response helpers
const stdheaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
}