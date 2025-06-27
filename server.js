import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// In-memory Kanban board
let columns = {
  todo: { name: "To Do", items: [] },
  inprogress: { name: "In Progress", items: [] },
  done: { name: "Done", items: [] }
}

// Get board
app.get('/api/board', (req, res) => {
  res.json(columns)
})

// Add task to "To Do"
app.post('/api/task', (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Task text required' })
  columns.todo.items.push({ text })
  res.json(columns)
})

// Move task between columns
app.post('/api/move', (req, res) => {
  const { from, to, idx } = req.body
  if (!columns[from] || !columns[to] || idx === undefined) {
    return res.status(400).json({ error: 'Invalid move' })
  }
  const [task] = columns[from].items.splice(idx, 1)
  if (task) columns[to].items.push(task)
  res.json(columns)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})