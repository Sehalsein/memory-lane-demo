const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('memories.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      username TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );
  `)

  // Create events table with a foreign key reference to memories table
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      memory_id INTEGER NOT NULL,
      FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
    );
  `)

  // Create images table with a foreign key reference to events table
  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      size INTEGER NOT NULL,
      type TEXT NOT NULL,
      event_id INTEGER,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `)
})

module.exports = db
