const nanoId = require('nanoid')
const config = require('./config')

const generateSlug = () => {
  return nanoId.nanoid(6)
}

const wrapEndpointForPath = (path) => {
  if (path.startsWith('http')) {
    return path
  }
  return `http://localhost:${config.PORT}/static${path}`
}

module.exports = {
  generateSlug,
  wrapEndpointForPath,
}
