const memoriesRouter = require('./routes/memories')
const eventRouter = require('./routes/events')
const fileRouter = require('./routes/files')
const laneRouter = require('./routes/lanes')
const authMiddleware = require('./middleware/auth.middleware')

function route(app) {
  app.use('/lanes', laneRouter)

  app.use(authMiddleware)
  app.use('/memories', memoriesRouter)
  app.use('/events', eventRouter)
  app.use('/files', fileRouter)
}

module.exports = route
