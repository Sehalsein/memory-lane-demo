const express = require('express')
const cors = require('cors')
const path = require('path')

const authMiddleware = require('./server/middleware/auth.middleware')
const routes = require('./server/route')
const config = require('./server/config')

const app = express()
const port = config.PORT

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(authMiddleware)

routes(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
