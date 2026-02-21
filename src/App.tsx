import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useGateValue, useStatsigClient } from '@statsig/react-bindings'

interface Note {
  id: number
  text: string
}

const STORAGE_KEY = 'notes'

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [input, setInput] = useState('')
  const isInputDisabled = useGateValue('disabled-input')
  const isDeleteDisabled = useGateValue('disabled-delete-id')
  const { logEvent } = useStatsigClient()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const nextId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1
    setNotes(prev => [{ id: nextId, text: trimmed }, ...prev])
    setInput('')
    logEvent('add_note', String(nextId), { note_text: trimmed })
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    logEvent('delete_note', String(id))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    addNote()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
          {notes.length > 0 && (
            <button
              onClick={() => setNotes([])}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete all
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Write a note..."
            disabled={isInputDisabled}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isInputDisabled}
            className="rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            Add
          </button>
        </form>
        {notes.length === 0 ? (
          <p className="text-center text-gray-400">No notes yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {notes.map(note => (
              <li
                key={note.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <span className="text-gray-700 break-all">{note.text}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  disabled={isDeleteDisabled}
                  className="ml-4 text-sm text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
