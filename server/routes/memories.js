const express = require('express')
const db = require('../db')
const { generateSlug, wrapEndpointForPath } = require('../utils')
const router = express.Router()

router.get('/', (req, res) => {
  const { username } = req.user

  const query = `
    SELECT 
      m.id AS memory_id, 
      m.name AS memory_name, 
      m.description AS memory_description, 
      m.timestamp AS memory_timestamp, 
      m.username AS memory_username, 
      m.slug AS memory_slug,
      COUNT(DISTINCT e.id) AS event_count,
      GROUP_CONCAT(
          DISTINCT JSON_OBJECT(
              'id', i.id, 
              'name', i.name, 
              'size', i.size, 
              'type', i.type, 
              'path', i.path,
              'eventId', i.event_id
          )
      ) AS images
    FROM memories m
    LEFT JOIN events e ON e.memory_id = m.id
    LEFT JOIN images i ON i.event_id = e.id
    WHERE m.username = ?
    GROUP BY m.id;
  `

  db.all(query, [username], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    const memories = rows.map((row) => {
      const images = row.images ? JSON.parse(`[${row.images}]`) : []

      return {
        id: row.memory_id,
        name: row.memory_name,
        description: row.memory_description,
        timestamp: row.memory_timestamp,
        username: row.memory_username,
        slug: row.memory_slug,
        eventCount: row.event_count,
        images: images[0].id
          ? images.map((e) => ({
              ...e,
              url: wrapEndpointForPath(e.path),
            }))
          : [],
      }
    })

    res.status(200).json({ memories })
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
