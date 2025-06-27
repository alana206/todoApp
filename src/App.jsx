import { useState } from 'react'
import './App.css'
import Login from './Login'

const initialColumns = {
  todo: { name: "To Do", items: [] },
  inprogress: { name: "In Progress", items: [] },
  done: { name: "Done", items: [] }
}

function App() {
  const [columns, setColumns] = useState(initialColumns)
  const [taskInput, setTaskInput] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const addTask = (e) => {
    e.preventDefault()
    if (!taskInput.trim()) return
    setColumns({
      ...columns,
      todo: {
        ...columns.todo,
        items: [...columns.todo.items, { text: taskInput }]
      }
    })
    setTaskInput('')
  }

  // Move task to another column
  const moveTask = (from, to, idx) => {
    const task = columns[from].items[idx]
    setColumns({
      ...columns,
      [from]: {
        ...columns[from],
        items: columns[from].items.filter((_, i) => i !== idx)
      },
      [to]: {
        ...columns[to],
        items: [...columns[to].items, task]
      }
    })
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div>
      <h1>Project Kanban Board</h1>
      <form onSubmit={addTask} className="snippet-form">
        <input
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          placeholder="Add a new task"
          className="snippet-input"
        />
        <button type="submit" className="snippet-btn">Add Task</button>
      </form>
      <div className="kanban-board">
        {Object.entries(columns).map(([colKey, col]) => (
          <div key={colKey} className="kanban-column">
            <h2>{col.name}</h2>
            <ul className="kanban-list">
              {col.items.map((item, idx) => (
                <li key={idx} className="kanban-card">
                  {item.text}
                  <div className="kanban-actions">
                    {colKey !== 'todo' && (
                      <button
                        className="snippet-btn"
                        type="button"
                        onClick={() => moveTask(colKey, 'todo', idx)}
                      >To Do</button>
                    )}
                    {colKey !== 'inprogress' && (
                      <button
                        className="snippet-btn"
                        type="button"
                        onClick={() => moveTask(colKey, 'inprogress', idx)}
                      >In Progress</button>
                    )}
                    {colKey !== 'done' && (
                      <button
                        className="snippet-btn"
                        type="button"
                        onClick={() => moveTask(colKey, 'done', idx)}
                      >Done</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
