/**
 * todo.controller.ts - HTTP Request Handler for Todo Endpoints
 * 
 * This controller handles all HTTP requests related to todos.
 * It receives HTTP requests, extracts data, calls the service layer,
 * and returns HTTP responses.
 * 
 * RESTful API Endpoints:
 * - POST   /todos       - Create a new todo
 * - GET    /todos       - Get all todos
 * - GET    /todos/:id   - Get a single todo by ID
 * - PUT    /todos/:id   - Update a todo
 * - DELETE /todos/:id   - Delete a todo
 * 
 * Key Concept: Controller Pattern
 * - Handles HTTP-specific concerns (request/response)
 * - Delegates business logic to services
 * - Maps HTTP methods to service methods
 */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

/**
 * @Controller('todos') Decorator
 * - 'todos' is the route prefix for all endpoints in this controller
 * - All routes will be prefixed with /todos
 * - Example: @Get() becomes GET /todos, @Post() becomes POST /todos
 */
@Controller('todos')
export class TodoController {
  /**
   * Constructor - Dependency Injection
   * 
   * Injects TodoService into the controller
   * NestJS automatically creates and provides the TodoService instance
   * 
   * readonly: Prevents reassignment of todoService after construction
   * private: Makes todoService only accessible within this class
   */
  constructor(private readonly todoService: TodoService) {}

  /**
   * POST /todos - Create a new todo
   * 
   * @Post() Decorator
   * - Maps this method to handle POST HTTP requests to /todos
   * 
   * @param createTodoDto - Extracted from request body using @Body() decorator
   *   Expected JSON format: { "title": "Buy groceries", "description": "Milk and eggs" }
   * 
   * @returns Promise<Todo> - The newly created todo (automatically converted to JSON)
   * 
   * Example Request:
   *   POST http://localhost:3001/todos
   *   Body: { "title": "Learn NestJS", "description": "Study the documentation" }
   * 
   * Example Response:
   *   201 Created
   *   { "_id": "507f1f77bcf86cd799439011", "title": "Learn NestJS", ... }
   */
  @Post()
  async create(@Body() createTodoDto: { title: string; description?: string }): Promise<Todo> {
    // Call service method to create todo in database
    // Service handles validation and database operations
    return this.todoService.create(createTodoDto);
  }

  /**
   * GET /todos - Retrieve all todos
   * 
   * @Get() Decorator
   * - Maps this method to handle GET HTTP requests to /todos
   * 
   * @returns Promise<Todo[]> - Array of all todos (automatically converted to JSON)
   * 
   * Example Request:
   *   GET http://localhost:3001/todos
   * 
   * Example Response:
   *   200 OK
   *   [{ "_id": "...", "title": "Todo 1", ... }, { "_id": "...", "title": "Todo 2", ... }]
   */
  @Get()
  async findAll(): Promise<Todo[]> {
    // Call service method to fetch all todos from database
    return this.todoService.findAll();
  }

  /**
   * GET /todos/:id - Retrieve a single todo by ID
   * 
   * @Get(':id') Decorator
   * - Maps this method to handle GET HTTP requests to /todos/:id
   * - :id is a route parameter (e.g., /todos/507f1f77bcf86cd799439011)
   * 
   * @param id - Extracted from URL parameter using @Param('id') decorator
   * 
   * @returns Promise<Todo> - The todo document with matching ID
   * 
   * Example Request:
   *   GET http://localhost:3001/todos/507f1f77bcf86cd799439011
   * 
   * Example Response:
   *   200 OK
   *   { "_id": "507f1f77bcf86cd799439011", "title": "Learn NestJS", ... }
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    // Call service method to find todo by ID
    // @Param('id') extracts the :id value from the URL
    return this.todoService.findOne(id);
  }

  /**
   * PUT /todos/:id - Update an existing todo
   * 
   * @Put(':id') Decorator
   * - Maps this method to handle PUT HTTP requests to /todos/:id
   * - PUT is used for full or partial updates
   * 
   * @param id - Todo ID from URL parameter
   * @param updateTodoDto - Partial update data from request body
   *   Can include any combination of: title, completed, description
   *   Only provided fields will be updated (partial update)
   * 
   * @returns Promise<Todo> - The updated todo document
   * 
   * Example Request:
   *   PUT http://localhost:3001/todos/507f1f77bcf86cd799439011
   *   Body: { "completed": true }
   * 
   * Example Response:
   *   200 OK
   *   { "_id": "507f1f77bcf86cd799439011", "title": "...", "completed": true, ... }
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: { title?: string; completed?: boolean; description?: string },
  ): Promise<Todo> {
    // Call service method to update todo
    // Service handles finding the document and updating only specified fields
    return this.todoService.update(id, updateTodoDto);
  }

  /**
   * DELETE /todos/:id - Delete a todo
   * 
   * @Delete(':id') Decorator
   * - Maps this method to handle DELETE HTTP requests to /todos/:id
   * 
   * @param id - Todo ID from URL parameter
   * 
   * @returns Promise<Todo> - The deleted todo document (before deletion)
   * 
   * Example Request:
   *   DELETE http://localhost:3001/todos/507f1f77bcf86cd799439011
   * 
   * Example Response:
   *   200 OK
   *   { "_id": "507f1f77bcf86cd799439011", "title": "...", ... }
   * 
   * Note: The todo is permanently removed from the database
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Todo> {
    // Call service method to delete todo
    // Service handles finding and removing the document from database
    return this.todoService.delete(id);
  }
}

