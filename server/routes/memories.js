const express = require('express')
const db = require('../db')
const { generateSlug } = require('../utils')
const router = express.Router()

router.get('/', (req, res) => {
  const { username } = req.user

  const query = 'SELECT * FROM memories WHERE username = ?'
  db.all(query, [username], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ memories: rows })
  })
})

router.post('/', (req, res) => {
  const { username } = req.user
  const { name, description } = req.body

  if (!name || !description) {
    return res.status(400).json({
      error: 'Please provide all required fields: name, description',
    })
  }

  const query =
    'INSERT INTO memories (name, description, timestamp, username, slug) VALUES (?, ?, ?, ?, ?)'
  const timestamp = new Date().toISOString()

  const slug = generateSlug()
  db.run(query, [name, description, timestamp, username, slug], function (err) {
    if (err) {
      console.error('Error creating memory:', err)
      return res.status(500).json({ error: 'Failed to create memory' })
    }

    res.status(201).json({
      message: 'Memory created successfully',
      memory: {
        id: this.lastID,
        name,
        description,
        timestamp,
        username,
        slug,
      },
    })
  })
})

router.get('/:id', (req, res) => {
  const { username } = req.user
  const { id } = req.params

  db.get(
    'SELECT * FROM memories WHERE id = ? AND username = ?',
    [id, username],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      if (!row) {
        res.status(404).json({ error: 'Memory not found' })
        return
      }

      res.json({ memory: row })
    }
  )
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, description } = req.body

  if (!name || !description) {
    return res.status(400).json({
      error: 'Please provide all fields: name, description',
    })
  }

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ? WHERE id = ?'
  )

  stmt.run(name, description, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    res.json({ message: 'Memory updated successfully' })
  })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})

module.exports = router
