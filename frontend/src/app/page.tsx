/**
 * page.tsx - Main ToDo Application Component
 * 
 * This is the main page component that renders the ToDo application UI.
 * It handles all user interactions and communicates with the backend API.
 * 
 * Key Features:
 * - Displays list of todos
 * - Create new todos
 * - Edit existing todos
 * - Toggle todo completion status
 * - Delete todos
 * 
 * 'use client' Directive:
 * - Required for Next.js 13+ App Router when using React hooks (useState, useEffect)
 * - Tells Next.js this component should run on the client side (browser)
 * - Without this, hooks would cause an error in server-side rendering
 */
'use client';

import { useState, useEffect } from 'react';
import './globals.css';

/**
 * Todo Interface - TypeScript Type Definition
 * 
 * Defines the structure of a Todo object.
 * This ensures type safety - TypeScript will error if we try to use
 * properties that don't exist on a Todo object.
 * 
 * Properties:
 * - _id: MongoDB-generated unique identifier (string)
 * - title: The todo task title (required string)
 * - description?: Optional additional details (string or undefined)
 * - completed: Whether the todo is done (boolean)
 * - createdAt?: Timestamp when todo was created (optional string)
 * - updatedAt?: Timestamp when todo was last updated (optional string)
 */
interface Todo {
  _id: string;
  title: string;
  description?: string; // ? means optional - may or may not be present
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API_URL - Backend API Base URL
 * 
 * Points to the NestJS backend server.
 * All API requests will be made to this URL with different endpoints appended.
 * 
 * Example endpoints:
 * - GET    http://localhost:3001/todos       (get all todos)
 * - POST   http://localhost:3001/todos       (create todo)
 * - PUT    http://localhost:3001/todos/:id   (update todo)
 * - DELETE http://localhost:3001/todos/:id   (delete todo)
 */
const API_URL = 'http://localhost:3001/todos';

/**
 * Home Component - Main ToDo Application Component
 * 
 * This is a React functional component that manages the entire ToDo application state and UI.
 * It uses React hooks to manage state and side effects.
 */
export default function Home() {
  /**
   * React State Hooks
   * 
   * useState hook creates state variables that trigger re-renders when changed.
   * Each useState call returns [currentValue, setterFunction].
   * 
   * State Variables:
   * - todos: Array of all todo items fetched from the backend
   * - title: Current value in the "create todo" title input field
   * - description: Current value in the "create todo" description input field
   * - editingId: ID of the todo currently being edited (null if not editing)
   * - editTitle: Current value in the "edit todo" title input field
   * - editDescription: Current value in the "edit todo" description input field
   * - loading: Boolean flag to show loading state while fetching data
   */
  const [todos, setTodos] = useState<Todo[]>([]); // Array of todos, starts empty
  const [title, setTitle] = useState(''); // Form input for creating new todo
  const [description, setDescription] = useState(''); // Form input for creating new todo
  const [editingId, setEditingId] = useState<string | null>(null); // Tracks which todo is being edited
  const [editTitle, setEditTitle] = useState(''); // Form input for editing todo title
  const [editDescription, setEditDescription] = useState(''); // Form input for editing todo description
  const [loading, setLoading] = useState(false); // Loading indicator state

  /**
   * useEffect Hook - Side Effects
   * 
   * Runs code after the component renders.
   * 
   * Dependencies: [] (empty array)
   * - Empty array means this effect runs only once when component first mounts
   * - Similar to componentDidMount in class components
   * 
   * Purpose: Fetch todos from backend when the page first loads
   */
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array = run once on mount

  /**
   * fetchTodos() - Fetches all todos from the backend API
   * 
   * This is an async function that makes an HTTP GET request to retrieve all todos.
   * 
   * Flow:
   * 1. Sets loading state to true (shows loading indicator)
   * 2. Makes GET request to API_URL
   * 3. Parses JSON response
   * 4. Updates todos state with fetched data
   * 5. Sets loading state to false (hides loading indicator)
   * 6. If error occurs, shows alert and logs error to console
   * 
   * Error Handling:
   * - try/catch block catches network errors or API errors
   * - Shows user-friendly error message
   * - Always sets loading to false in finally block
   */
  const fetchTodos = async () => {
    try {
      setLoading(true); // Show loading indicator
      
      // Fetch API endpoint - GET request returns all todos
      const response = await fetch(API_URL);
      
      // Parse JSON response into JavaScript object
      const data = await response.json();
      
      // Update todos state - this triggers a re-render to show the todos
      setTodos(data);
    } catch (error) {
      // Handle errors - log to console and show alert to user
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos. Make sure the backend is running on http://localhost:3001');
    } finally {
      // Always runs, whether success or error
      setLoading(false); // Hide loading indicator
    }
  };

  /**
   * createTodo() - Creates a new todo
   * 
   * Called when the user submits the "Create Todo" form.
   * 
   * @param e - React form event (prevents default form submission behavior)
   * 
   * Flow:
   * 1. Prevents default form submission (page reload)
   * 2. Validates that title is not empty
   * 3. Makes POST request to backend with todo data
   * 4. If successful, clears form fields and refreshes todo list
   * 
   * HTTP Request:
   * - Method: POST
   * - Body: { title: string, description?: string }
   * - Content-Type: application/json
   */
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    
    // Validation: Don't create todo if title is empty or only whitespace
    if (!title.trim()) return;

    try {
      // POST request to create new todo
      const response = await fetch(API_URL, {
        method: 'POST', // HTTP method for creating resources
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify({ title, description }), // Convert object to JSON string
      });

      // If request was successful (status 200-299)
      if (response.ok) {
        // Clear form inputs
        setTitle('');
        setDescription('');
        
        // Refresh todo list to show the new todo
        fetchTodos();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    }
  };

  /**
   * toggleComplete() - Toggles the completion status of a todo
   * 
   * Called when user clicks the checkbox to mark a todo as complete/incomplete.
   * 
   * @param id - The MongoDB _id of the todo to update
   * @param completed - Current completion status (will be toggled)
   * 
   * Flow:
   * 1. Makes PUT request with opposite completion status
   * 2. Refreshes todo list to show updated status
   */
  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      // PUT request to update todo - only the completed field
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // HTTP method for updating resources
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }), // Toggle the value
      });
      
      // Refresh list to show updated completion status
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  /**
   * startEdit() - Enters edit mode for a todo
   * 
   * Called when user clicks the "Edit" button.
   * Switches the todo from view mode to edit mode.
   * 
   * @param todo - The todo object to edit
   * 
   * Flow:
   * 1. Sets editingId to the todo's ID (marks it as being edited)
   * 2. Populates edit form fields with current todo values
   */
  const startEdit = (todo: Todo) => {
    setEditingId(todo._id); // Mark this todo as being edited
    setEditTitle(todo.title); // Pre-fill edit form with current title
    setEditDescription(todo.description || ''); // Pre-fill with current description (or empty string)
  };

  /**
   * saveEdit() - Saves the edited todo
   * 
   * Called when user clicks "Save" while editing a todo.
   * 
   * @param id - The MongoDB _id of the todo being edited
   * 
   * Flow:
   * 1. Validates that title is not empty
   * 2. Makes PUT request with updated values
   * 3. Exits edit mode and refreshes todo list
   */
  const saveEdit = async (id: string) => {
    // Validation: Don't save if title is empty
    if (!editTitle.trim()) return;

    try {
      // PUT request to update todo with new values
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
      
      // Exit edit mode
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      
      // Refresh list to show updated values
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  /**
   * cancelEdit() - Cancels editing and returns to view mode
   * 
   * Called when user clicks "Cancel" while editing.
   * Discards any changes made in the edit form.
   * 
   * Flow:
   * 1. Clears editingId (exits edit mode)
   * 2. Clears edit form fields
   */
  const cancelEdit = () => {
    setEditingId(null); // Exit edit mode
    setEditTitle(''); // Clear edit form
    setEditDescription(''); // Clear edit form
  };

  /**
   * deleteTodo() - Deletes a todo from the database
   * 
   * Called when user clicks the "Delete" button.
   * 
   * @param id - The MongoDB _id of the todo to delete
   * 
   * Flow:
   * 1. Shows confirmation dialog to prevent accidental deletion
   * 2. If confirmed, makes DELETE request
   * 3. Refreshes todo list to remove deleted todo
   */
  const deleteTodo = async (id: string) => {
    // Show confirmation dialog - if user clicks Cancel, function returns early
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      // DELETE request to remove todo from database
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE', // HTTP method for deleting resources
      });
      
      // Refresh list to show todo is removed
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  /**
   * JSX Return - Renders the UI
   * 
   * This return statement contains JSX (JavaScript XML) which describes the UI structure.
   * JSX looks like HTML but it's actually JavaScript that gets compiled to React elements.
   */
  return (
    <main className="container">
      {/* Page Title */}
      <h1>My ToDo App</h1>

      {/* Create Todo Form */}
      {/* onSubmit: Calls createTodo() when form is submitted (Enter key or button click) */}
      <form onSubmit={createTodo} className="form">
        {/* Title Input Field */}
        {/* 
          Controlled Input: 
          - value={title}: Displays current state value
          - onChange: Updates state when user types
          - Two-way data binding: state controls input, input updates state
        */}
        <input
          type="text"
          placeholder="Todo title..."
          value={title} // Controlled by React state
          onChange={(e) => setTitle(e.target.value)} // Update state on every keystroke
          className="input"
        />
        
        {/* Description Input Field */}
        <input
          type="text"
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>

      {/* Todo List Container */}
      <div className="todo-list">
        {/* Loading Indicator */}
        {/* Conditional Rendering: Only shows if loading is true */}
        {loading && <p>Loading...</p>}
        
        {/* Empty State Message */}
        {/* Shows when there are no todos and not currently loading */}
        {todos.length === 0 && !loading && (
          <p className="empty">No todos yet. Create one above!</p>
        )}
        
        {/* Todo Items List */}
        {/* 
          .map() iterates over todos array and creates a div for each todo
          key prop: Required by React to efficiently update the list
          Each todo gets a unique key (the _id) so React can track which items changed
        */}
        {todos.map((todo) => (
          <div 
            key={todo._id} // Unique key for React's virtual DOM
            className={`todo-item ${todo.completed ? 'completed' : ''}`} // Conditional CSS class
          >
            {/* Conditional Rendering: Edit Mode vs View Mode */}
            {/* 
              Ternary Operator: condition ? ifTrue : ifFalse
              If editingId matches this todo's id, show edit form, otherwise show view
            */}
            {editingId === todo._id ? (
              /* ===== EDIT MODE ===== */
              <div className="edit-form">
                {/* Edit Title Input */}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                />
                
                {/* Edit Description Input */}
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description..."
                  className="input"
                />
                
                {/* Edit Action Buttons */}
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
              /* ===== VIEW MODE ===== */
              <>
                {/* Todo Content Section */}
                <div className="todo-content">
                  {/* Completion Checkbox */}
                  {/* 
                    Checked state is controlled by todo.completed
                    onChange toggles the completion status via API call
                  */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id, todo.completed)}
                    className="checkbox"
                  />
                  
                  {/* Todo Text Display */}
                  <div className="todo-text">
                    <h3>{todo.title}</h3>
                    {/* Conditional Rendering: Only show description if it exists */}
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="btn-group">
                  {/* Edit Button - Switches to edit mode */}
                  <button onClick={() => startEdit(todo)} className="btn btn-edit">
                    Edit
                  </button>
                  
                  {/* Delete Button - Removes todo from database */}
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

