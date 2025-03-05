const authMiddleware = async (req, res, next) => {
  const username = req.headers['x-api-username']

  if (!username) {
    return res.status(401).json({ error: 'x-api-username is missing' })
  }

  req.user = { username }
  next()
}

module.exports = authMiddleware
