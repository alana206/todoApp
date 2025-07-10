import express from 'express'
import cors from 'cors'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'

const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000;
const DATA_FILE = './kanban-data.json'
const USERS_FILE = './users.json'

app.use(cors())
app.use(express.json())

// Load or initialize board
const loadBoard = async () => {
  if (await fs.pathExists(DATA_FILE)) {
    return fs.readJson(DATA_FILE)
  }
  const initial = {
    todo: { name: "To Do", items: [] },
    inprogress: { name: "In Progress", items: [] },
    done: { name: "Done", items: [] }
  }
  await fs.writeJson(DATA_FILE, initial)
  return initial
}

const saveBoard = (data) => fs.writeJson(DATA_FILE, data)

let columns
loadBoard().then(data => { columns = data })

app.get('/api/board', (req, res) => {
  res.json(columns)
})

app.post('/api/task', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Task text required' })
  columns.todo.items.push({ text })
  await saveBoard(columns)
  res.json(columns)
})

app.post('/api/move', async (req, res) => {
  const { from, to, idx } = req.body
  if (!columns[from] || !columns[to] || idx === undefined) {
    return res.status(400).json({ error: 'Invalid move' })
  }
  const [task] = columns[from].items.splice(idx, 1)
  if (task) columns[to].items.push(task)
  await saveBoard(columns)
  res.json(columns)
})

app.post('/api/save', async (req, res) => {
  const data = req.body
  await saveBoard(data)
  columns = data
  res.json({ success: true })
})

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Example: Query users
app.get('/api/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users')
  res.json(result.rows)
})

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  try {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'User exists or DB error' })
  }
})

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    res.json({ success: true, firstName: result.rows[0].username })
  } catch (err) {
    res.status(500).json({ error: 'Database error' })
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, 'dist')))
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})