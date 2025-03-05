const memoriesRouter = require('./routes/memories')
const eventRouter = require('./routes/events')
const fileRouter = require('./routes/files')

function route(app) {
  app.use('/memories', memoriesRouter)
  app.use('/events', eventRouter)
  app.use('/files', fileRouter)
}

module.exports = route
