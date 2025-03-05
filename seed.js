const fs = require('fs')
const db = require('./server/db')
const { generateSlug } = require('./server/utils')

db.serialize(() => {
  const memoriesData = fs.readFileSync('./data.json').toString('utf-8')
  const memories = JSON.parse(memoriesData)

  const insertMemory = db.prepare(
    `INSERT INTO memories (name, description, timestamp, username, slug) VALUES (?, ?, ?, ?, ?)`
  )
  const insertEvent = db.prepare(
    `INSERT INTO events (name, description, timestamp, memory_id) VALUES (?, ?, ?, ?)`
  )
  const insertImage = db.prepare(
    `INSERT INTO images (name, path, size, type, event_id) VALUES (?, ?, ?, ?, ?)`
  )

  const processMemories = async () => {
    for (const memory of memories) {
      const slug = generateSlug()

      const memoryId = await new Promise((resolve, reject) => {
        insertMemory.run(
          memory.name,
          memory.description,
          memory.timestamp,
          memory.username,
          slug,
          function (err) {
            if (err) reject(err)
            resolve(this.lastID)
          }
        )
      })

      for (const event of memory.events) {
        const eventId = await new Promise((resolve, reject) => {
          insertEvent.run(
            event.name,
            event.description,
            event.timestamp,
            memoryId,
            function (err) {
              if (err) reject(err)
              resolve(this.lastID)
            }
          )
        })

        for (const image of event.images) {
          await new Promise((resolve, reject) => {
            insertImage.run(
              image.name,
              image.url,
              image.size,
              image.type || 'image/jpeg',
              eventId,
              function (err) {
                if (err) reject(err)
                resolve()
              }
            )
          })
        }
      }
    }

    insertMemory.finalize()
    insertEvent.finalize()
    insertImage.finalize()
    console.log('Database population completed successfully')
  }

  processMemories()
    .then(() => {
      db.close()
    })
    .catch((err) => {
      console.error('Error populating database:', err)
      insertMemory.finalize()
      insertEvent.finalize()
      insertImage.finalize()
      db.close()
    })
})
