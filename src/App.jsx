import { useState } from 'react'
import './App.css'
import Login from './Login'
import { Checkbox, FormControlLabel } from '@mui/material'

const setStateForColums = {
  todo: { name: "To Do", items: [] },
  inprogress: { name: "In Progress", items: [] },
  done: { name: "Done", items: [] }
}

function App() {
  const [columns, setColumns] = useState(setStateForColums)
  const [taskInput, setTaskInput] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const [firstName, setFirstName] = useState('User')

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

  const saveBoard = async () => {
    await fetch('http://localhost:8000/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(columns)
    })
    alert('Board saved!')
  }

  const markAllDone = () => {
    setColumns({
      ...columns,
      done: {
        ...columns.done,
        items: [
          ...columns.done.items,
          ...columns.todo.items,
          ...columns.inprogress.items
        ]
      },
      todo: { ...columns.todo, items: [] },
      inprogress: { ...columns.inprogress, items: [] }
    })
  }

  // Pass a callback to Login to set the user's first name
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(name) => {
          setIsLoggedIn(true)
          setFirstName(name || 'User')
        }}
      />
    )
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setFirstName('User')
  }

  return (
    <div>
      <header className="kanban-header">
        <h1 className="kanban-title">Project Kanban Board</h1>
        <div className="kanban-header-actions">
          <button className="snippet-btn" onClick={saveBoard}>Save Board</button>
          <button className="snippet-btn" onClick={handleLogout}>Logout</button>
          <FormControlLabel
            control={
              <Checkbox
                onChange={e => {
                  if (e.target.checked) {
                    markAllDone();
                    e.target.checked = false;
                  }
                }}
                color="primary"
              />
            }
            label="Mark All Done"
          />
        </div>
      </header>
      <div className="hello-user">Hello, {firstName}</div>
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
