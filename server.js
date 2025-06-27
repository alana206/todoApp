import express from 'express'
import cors from 'cors'
import fs from 'fs-extra'

const app = express()
const PORT = 4000
const DATA_FILE = './kanban-data.json'

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})