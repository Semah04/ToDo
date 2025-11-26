'use client';

import { useState, useEffect } from 'react';
import './globals.css';

// Define the Todo interface
interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API base URL - points to NestJS backend
const API_URL = 'http://localhost:3001/todos';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from backend API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos. Make sure the backend is running on http://localhost:3001');
    } finally {
      setLoading(false);
    }
  };

  // Create a new todo
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    }
  };

  // Update todo completion status
  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  // Start editing a todo
  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Save edited todo
  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  return (
    <main className="container">
      <h1>My ToDo App</h1>

      {/* Create Todo Form */}
      <form onSubmit={createTodo} className="form">
        <input
          type="text"
          placeholder="Todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      <div className="todo-list">
        {loading && <p>Loading...</p>}
        {todos.length === 0 && !loading && (
          <p className="empty">No todos yet. Create one above!</p>
        )}
        {todos.map((todo) => (
          <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {editingId === todo._id ? (
              // Edit mode
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description..."
                  className="input"
                />
                <div className="btn-group">
                  <button onClick={() => saveEdit(todo._id)} className="btn btn-success">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id, todo.completed)}
                    className="checkbox"
                  />
                  <div className="todo-text">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                </div>
                <div className="btn-group">
                  <button onClick={() => startEdit(todo)} className="btn btn-edit">
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

