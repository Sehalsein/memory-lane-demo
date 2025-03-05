const express = require('express')
const upload = require('../lib/multer')
const db = require('../db')

const router = express.Router()

router.post('/upload', upload.array('images'), (req, res) => {
  const { username } = req.user
  const files = req.files.map((file) => {
    return {
      name: file.filename,
      path: `/${username}/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    }
  })

  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      console.log('Error beginning transaction:', err)
      return res.status(500).json({ error: 'Failed to upload images' })
    }

    const stmt = db.prepare(
      'INSERT INTO images (name, size, type, path) VALUES (?, ?, ?, ?)'
    )

    const insertedFiles = []
    files.forEach((file) => {
      stmt.run(file.name, file.size, file.type, file.path, function (err) {
        if (err) {
          console.log('Error inserting row:', err)
          db.run('ROLLBACK')
          return res.status(500).json({ error: 'Failed to upload files' })
        }

        insertedFiles.push({
          id: this.lastID,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      })
    })

    stmt.finalize((err) => {
      if (err) {
        console.log('Error finalizing statement:', err)
        db.run('ROLLBACK')
        return res.status(500).json({ error: 'Failed to finalize statement' })
      }

      db.run('COMMIT', (err) => {
        if (err) {
          console.log('Error committing transaction:', err)
          db.run('ROLLBACK')
          return res.status(500).json({ error: 'Failed to commit transaction' })
        }

        // Return the inserted files with their IDs
        res.status(201).json({
          message: 'Files uploaded successfully',
          files: insertedFiles,
        })
      })
    })
  })
})

module.exports = router
