# Simple CRUD ToDo Application

A full-stack ToDo application built with **Next.js** (frontend), **NestJS** (backend), and **MongoDB** (database).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed and running on your machine
- npm or yarn package manager

### Installation & Running

#### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# Or use: mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

#### 2. Setup and Run Backend (NestJS)
```bash
cd backend
npm install

# Create .env file (optional - app will use defaults if not present)
# Copy env.example to .env and update values if needed
# cp env.example .env

npm run start:dev
```
The backend will run on **http://localhost:3001**

**Note:** The `.env` file is located in the `backend/` folder. If you don't create one, the app will use default values (MongoDB on localhost:27017, port 3001). See the Configuration section below for more details.

#### 3. Setup and Run Frontend (Next.js)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on **http://localhost:3000**

Open your browser and navigate to `http://localhost:3000` to see the application.

---

## 📁 Project Structure

```
ToDo/
│
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   └── todo/
│   │       ├── todo.module.ts      # Todo feature module
│   │       ├── todo.controller.ts  # HTTP endpoints (routes)
│   │       ├── todo.service.ts     # Business logic
│   │       └── todo.schema.ts      # MongoDB schema/model
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx       # Main ToDo UI component
│   │       ├── layout.tsx     # Root layout
│   │       └── globals.css    # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
└── README.md                   # This file
```

---

## 📄 File-by-File Guide

### Backend Files (NestJS)

#### `backend/src/main.ts`
**Purpose**: Application entry point - starts the NestJS server
**What it does**:
- Creates the NestJS application instance
- Enables CORS (Cross-Origin Resource Sharing) so the Next.js frontend can communicate with the backend
- Starts the server on port 3001
- Logs a message when the server is ready

**Key Code**:
- `NestFactory.create(AppModule)` - Creates the app from the root module
- `app.enableCors()` - Allows requests from `http://localhost:3000` (Next.js frontend)
- `app.listen(3001)` - Starts the server on port 3001

---

#### `backend/src/app.module.ts`
**Purpose**: Root module that ties everything together
**What it does**:
- Imports and configures MongoDB connection using Mongoose
- Imports the TodoModule to make Todo features available throughout the app

**Key Code**:
- `MongooseModule.forRoot('mongodb://localhost:27017/todoapp')` - Connects to MongoDB
  - `localhost:27017` - MongoDB default host and port
  - `todoapp` - Database name
- `TodoModule` - Imports the Todo feature module

---

#### `backend/src/todo/todo.schema.ts`
**Purpose**: Defines the structure of a Todo document in MongoDB
**What it does**:
- Creates a schema (data structure) for Todo items
- Each Todo has:
  - `title` (required string) - The todo task title
  - `completed` (boolean, default: false) - Whether the todo is done
  - `description` (optional string) - Additional details
  - `createdAt` and `updatedAt` (auto-generated timestamps)

**Key Code**:
- `@Schema({ timestamps: true })` - Automatically adds createdAt and updatedAt fields
- `@Prop({ required: true })` - Makes title mandatory
- `@Prop({ default: false })` - Sets default value for completed

---

#### `backend/src/todo/todo.service.ts`
**Purpose**: Contains all the business logic for Todo operations
**What it does**:
- Handles all database operations (CRUD)
- Methods:
  - `create()` - Creates a new todo in MongoDB
  - `findAll()` - Gets all todos from MongoDB
  - `findOne()` - Gets a single todo by ID
  - `update()` - Updates an existing todo
  - `delete()` - Removes a todo from MongoDB

**Key Code**:
- `@InjectModel(Todo.name)` - Injects the Todo model for database operations
- `new this.todoModel(createTodoDto)` - Creates a new document
- `.save()` - Saves to database
- `.find()` - Queries all documents
- `.findByIdAndUpdate()` - Updates a document by ID
- `.findByIdAndDelete()` - Deletes a document by ID

---

#### `backend/src/todo/todo.controller.ts`
**Purpose**: Defines HTTP API endpoints (routes)
**What it does**:
- Maps HTTP requests to service methods
- Endpoints:
  - `POST /todos` - Create a new todo
  - `GET /todos` - Get all todos
  - `GET /todos/:id` - Get a specific todo
  - `PUT /todos/:id` - Update a todo
  - `DELETE /todos/:id` - Delete a todo

**Key Code**:
- `@Controller('todos')` - Base route for all endpoints in this controller
- `@Post()` - Handles POST requests
- `@Get()` - Handles GET requests
- `@Put(':id')` - Handles PUT requests with ID parameter
- `@Delete(':id')` - Handles DELETE requests with ID parameter
- `@Body()` - Extracts JSON data from request body
- `@Param('id')` - Extracts URL parameter (e.g., `/todos/123` → id = "123")

---

#### `backend/src/todo/todo.module.ts`
**Purpose**: Wires together the Todo feature components
**What it does**:
- Registers the Todo schema with MongoDB
- Makes TodoController and TodoService available to the app
- Connects controller, service, and schema together

**Key Code**:
- `MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])` - Registers Todo schema
- `controllers: [TodoController]` - Registers the controller
- `providers: [TodoService]` - Registers the service

---

### Frontend Files (Next.js)

#### `frontend/src/app/page.tsx`
**Purpose**: Main UI component that displays and manages todos
**What it does**:
- Renders the ToDo application interface
- Manages state (todos list, form inputs, editing mode)
- Makes API calls to the backend to perform CRUD operations
- Handles user interactions (create, edit, delete, toggle complete)

**Key Features**:
1. **State Management**:
   - `todos` - Array of all todo items
   - `title`, `description` - Form inputs for creating todos
   - `editingId` - Tracks which todo is being edited
   - `editTitle`, `editDescription` - Form inputs for editing

2. **Functions**:
   - `fetchTodos()` - GET request to load all todos
   - `createTodo()` - POST request to create a new todo
   - `toggleComplete()` - PUT request to toggle completion status
   - `startEdit()` - Enters edit mode for a todo
   - `saveEdit()` - PUT request to save edited todo
   - `deleteTodo()` - DELETE request to remove a todo

3. **Rendering**:
   - Form to create new todos
   - List of todos with checkboxes, edit, and delete buttons
   - Edit form that appears when editing

**Key Code**:
- `useState` - React hook for managing component state
- `useEffect` - React hook that runs `fetchTodos()` when component loads
- `fetch(API_URL)` - Makes HTTP requests to backend
- Conditional rendering: Shows edit form when `editingId` matches todo ID

---

#### `frontend/src/app/layout.tsx`
**Purpose**: Root layout component that wraps all pages
**What it does**:
- Defines the HTML structure for the app
- Sets page metadata (title, description)
- Provides the base layout that all pages use

**Key Code**:
- `RootLayout` - Wraps all pages with HTML and body tags
- `metadata` - Sets page title and description for SEO

---

#### `frontend/src/app/globals.css`
**Purpose**: Global styles for the entire application
**What it does**:
- Styles all UI components
- Creates a modern, gradient background
- Styles forms, buttons, todo items, and layout
- Includes responsive design for mobile devices

**Key Styles**:
- Gradient background (purple/blue)
- White cards with rounded corners and shadows
- Color-coded buttons (primary, success, danger, edit)
- Hover effects and transitions
- Responsive design for mobile screens

---

## 🔄 How the Application Works

### Data Flow:

1. **User Action** → User clicks a button or submits a form in the browser
2. **Frontend (Next.js)** → Makes an HTTP request to the backend API
3. **Backend (NestJS)** → Receives the request, processes it through controller → service
4. **Database (MongoDB)** → Service performs database operation (create/read/update/delete)
5. **Response** → Data flows back: MongoDB → Service → Controller → Frontend
6. **UI Update** → Frontend updates the display with new data

### Example: Creating a Todo

1. User types "Buy groceries" in the form and clicks "Add Todo"
2. Frontend `createTodo()` function sends POST request to `http://localhost:3001/todos`
3. Backend `TodoController.create()` receives the request
4. Controller calls `TodoService.create()` with the data
5. Service saves the new todo to MongoDB
6. MongoDB returns the saved todo
7. Service returns it to the controller
8. Controller sends it back to frontend as JSON
9. Frontend calls `fetchTodos()` to refresh the list
10. New todo appears in the UI

---

## 🛠️ API Endpoints

All endpoints are prefixed with `http://localhost:3001/todos`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/todos` | Get all todos | None |
| GET | `/todos/:id` | Get a specific todo | None |
| POST | `/todos` | Create a new todo | `{ "title": "string", "description": "string" }` |
| PUT | `/todos/:id` | Update a todo | `{ "title": "string", "completed": boolean, "description": "string" }` |
| DELETE | `/todos/:id` | Delete a todo | None |

---

## 🔧 Configuration

### Environment Variables (.env file)

The backend uses environment variables for configuration. The `.env` file should be located in the `backend/` folder.

**Location:** `backend/.env`

**To set up:**
1. Copy `backend/env.example` to `backend/.env`
2. Update the values as needed:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/todoapp

# Server Port
PORT=3001

# CORS Origins (comma-separated list)
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

**Default Values (if .env not provided):**
- MongoDB: `mongodb://localhost:27017/todoapp`
- Port: `3001`
- CORS: `http://localhost:3000,http://localhost:3002`

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

**Note:** The `.env` file is ignored by git (see `.gitignore`) to keep sensitive information private. Make sure to create your own `.env` file from `env.example`.

---

## 📝 Notes

- This is a simple, educational example. For production, add:
  - Input validation
  - Error handling
  - Authentication/Authorization
  - Environment variables for configuration
  - Unit tests
  - API documentation (Swagger)

- Make sure MongoDB is running before starting the backend
- Both servers (backend on 3001, frontend on 3000) must be running simultaneously

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify port 3001 is not in use
- Make sure you've installed dependencies: `npm install` (including @nestjs/config for .env support)
- Check terminal for error messages
- If using .env file, verify it's in the `backend/` folder and has correct format

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check CORS settings in `backend/src/main.ts`
- Verify API_URL in `frontend/src/app/page.tsx`

**Todos not saving:**
- Verify MongoDB connection string is correct
- Check MongoDB logs for errors
- Ensure database has write permissions

---

## 📚 Technologies Used

- **Next.js 14** - React framework for frontend
- **NestJS** - Node.js framework for backend
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **TypeScript** - Type-safe JavaScript
- **React Hooks** - State management in frontend

---

Happy coding! 🎉

