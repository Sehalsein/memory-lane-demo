const express = require('express')
const db = require('../db')
const { generateSlug, wrapEndpointForPath } = require('../utils')
const router = express.Router()

router.get('/:slug', (req, res) => {
  const { slug } = req.params

  const query = `
        SELECT 
            m.id AS memory_id, m.name AS memory_name, m.description AS memory_description, 
            m.timestamp AS memory_timestamp, m.username AS memory_username, m.slug AS memory_slug,
            e.id AS event_id, e.name AS event_name, e.description AS event_description, 
            e.timestamp AS event_timestamp,
            i.id AS image_id, i.name AS image_name, i.size AS image_size, i.type AS image_type, i.path AS image_path
        FROM memories m
        LEFT JOIN events e ON e.memory_id = m.id
        LEFT JOIN images i ON i.event_id = e.id
        WHERE m.slug = ?
        ORDER BY e.timestamp ASC, i.id ASC;
    `

  db.all(query, [slug], (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err)
      res.status(500).send('Error fetching data')
      return
    }

    if (!rows.length) {
      console.log('No memory found for the given slug.')
      res.status(404).send('Memory not found')
      return
    }

    const memory = {
      id: rows[0].memory_id,
      name: rows[0].memory_name,
      description: rows[0].memory_description,
      timestamp: rows[0].memory_timestamp,
      username: rows[0].memory_username,
      slug: rows[0].memory_slug,
      events: [],
    }

    const eventsMap = new Map()

    rows.forEach((row) => {
      if (row.event_id) {
        if (!eventsMap.has(row.event_id)) {
          eventsMap.set(row.event_id, {
            id: row.event_id,
            name: row.event_name,
            description: row.event_description,
            timestamp: row.event_timestamp,
            images: [],
          })
        }

        if (row.image_id) {
          eventsMap.get(row.event_id).images.push({
            id: row.image_id,
            name: row.image_name,
            size: row.image_size,
            type: row.image_type,
            url: wrapEndpointForPath(row.image_path),
          })
        }
      }
    })

    memory.events = Array.from(eventsMap.values()).sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    )
    res.status(200).json(memory)
  })
})

module.exports = router
