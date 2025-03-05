const express = require('express')

const db = require('../db')
const { wrapEndpointForPath } = require('../utils')

const router = express.Router()

router.get('/', (req, res) => {
  const { memoryId } = req.query

  if (!memoryId) {
    return res.status(400).json({
      error: 'Please provide a memory ID',
    })
  }

  const query =
    'SELECT events.id AS event_id, events.name AS event_name, events.description AS event_description, events.timestamp AS event_timestamp, events.memory_id, images.id AS image_id, images.name AS image_name, images.size AS image_size, images.type AS image_type, images.event_id AS image_event_id, images.path AS image_path ' +
    'FROM events ' +
    'LEFT JOIN images ON images.event_id = events.id ' +
    'WHERE events.memory_id = ?' +
    'ORDER BY events.timestamp DESC'

  db.all(query, [memoryId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const eventsMap = {}

    rows.forEach((row) => {
      if (!eventsMap[row.event_id]) {
        eventsMap[row.event_id] = {
          id: row.event_id,
          name: row.event_name,
          description: row.event_description,
          timestamp: row.event_timestamp,
          memoryId: row.memory_id,
          images: [],
        }
      }

      if (row.image_id) {
        const image = {
          id: row.image_id,
          name: row.image_name,
          size: row.image_size,
          type: row.image_type,
          eventId: row.image_event_id,
          url: wrapEndpointForPath(row.image_path),
        }
        eventsMap[row.event_id].images.push(image)
      }
    })

    // Convert the events map to an array
    const events = Object.values(eventsMap).sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    )

    res.json({ events })
  })
})

router.post('/', (req, res) => {
  const { name, description, memoryId, images, timestamp } = req.body

  if (!name || !description || !memoryId || !images || images.length === 0) {
    return res.status(400).json({
      error:
        'Please provide all required fields: name, description, memoryId, imageIds',
    })
  }

  const insertEventQuery =
    'INSERT INTO events (name, description, timestamp, memory_id) VALUES (?, ?, ?, ?)'
  const updateImagesQuery =
    'UPDATE images SET event_id = ? WHERE id IN (' +
    images.map(() => '?').join(',') +
    ')'

  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.log('Error beginning transaction:', err)
      return res.status(500).json({ error: 'Failed to create an event' })
    }

    db.run(
      insertEventQuery,
      [name, description, timestamp, memoryId],
      function (err) {
        if (err) {
          console.error('Error creating event:', err)
          db.run('ROLLBACK')
          return res.status(500).json({ error: 'Failed to create event' })
        }

        const eventId = this.lastID

        db.run(
          updateImagesQuery,
          [eventId, ...images.map((e) => e.id)],
          (err) => {
            if (err) {
              console.error('Error updating images:', err)
              db.run('ROLLBACK')
              return res.status(500).json({ error: 'Failed to update images' })
            }

            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                console.error('Error committing transaction:', commitErr)
                return res
                  .status(500)
                  .json({ error: 'Transaction commit failed' })
              }

              res.status(201).json({
                message: 'Event created successfully',
                event: { id: eventId, name, description, timestamp, memoryId },
              })
            })
          }
        )
      }
    )
  })
})

router.get('/:id', (req, res) => {
  const { id } = req.params

  // We can move this to a service file to reuse with list and get request.
  // Keep it here just to avoid creating service file for now.
  const query =
    'SELECT events.id AS event_id, events.name AS event_name, events.description AS event_description, events.timestamp AS event_timestamp, events.memory_id, images.id AS image_id, images.name AS image_name, images.size AS image_size, images.type AS image_type, images.event_id AS image_event_id, images.path AS image_path ' +
    'FROM events ' +
    'LEFT JOIN images ON images.event_id = events.id ' +
    'WHERE events.id = ?'

  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const eventsMap = {}

    rows.forEach((row) => {
      if (!eventsMap[row.event_id]) {
        eventsMap[row.event_id] = {
          id: row.event_id,
          name: row.event_name,
          description: row.event_description,
          timestamp: row.event_timestamp,
          memoryId: row.memory_id,
          images: [],
        }
      }

      if (row.image_id) {
        const image = {
          id: row.image_id,
          name: row.image_name,
          size: row.image_size,
          type: row.image_type,
          eventId: row.image_event_id,
          url: wrapEndpointForPath(row.image_path),
        }
        eventsMap[row.event_id].images.push(image)
      }
    })

    const events = Object.values(eventsMap)

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }

    res.json({ event: events[0] })
  })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, description, images, timestamp } = req.body

  if (!name || !description || !images || images.length === 0) {
    return res.status(400).json({
      error: 'Please provide all required fields: name, description, imageIds',
    })
  }

  const updateEventQuery =
    'UPDATE events SET name = ?, description = ?, timestamp = ? WHERE id = ?'
  const updateImagesQuery =
    'UPDATE images SET event_id = ? WHERE id IN (' +
    images.map(() => '?').join(',') +
    ')'

  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.log('Error beginning transaction:', err)
      return res.status(500).json({ error: 'Failed to create an event' })
    }

    db.run(
      updateEventQuery,
      [name, description, timestamp, id],
      function (err) {
        if (err) {
          console.error('Error creating event:', err)
          db.run('ROLLBACK')
          return res.status(500).json({ error: 'Failed to update event' })
        }

        db.run(
          'UPDATE images SET event_id = NULL WHERE event_id = ?',
          [id],
          (err) => {
            if (err) {
              console.error('Error updating images:', err)
              db.run('ROLLBACK')
              return res.status(500).json({ error: 'Failed to update images' })
            }

            db.run(
              updateImagesQuery,
              [id, ...images.map((e) => e.id)],
              (err) => {
                if (err) {
                  console.error('Error updating images:', err)
                  db.run('ROLLBACK')
                  return res
                    .status(500)
                    .json({ error: 'Failed to update images' })
                }

                db.run('COMMIT', (commitErr) => {
                  if (commitErr) {
                    console.error('Error committing transaction:', commitErr)
                    return res
                      .status(500)
                      .json({ error: 'Transaction commit failed' })
                  }

                  res.status(201).json({
                    message: 'Event updated successfully',
                  })
                })
              }
            )
          }
        )
      }
    )
  })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM events WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Event deleted successfully' })
  })
})

module.exports = router
