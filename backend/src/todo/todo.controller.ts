import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // POST /todos - Create a new todo
  @Post()
  async create(@Body() createTodoDto: { title: string; description?: string }): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  // GET /todos - Get all todos
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  // GET /todos/:id - Get a single todo by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  // PUT /todos/:id - Update a todo
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: { title?: string; completed?: boolean; description?: string },
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto);
  }

  // DELETE /todos/:id - Delete a todo
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Todo> {
    return this.todoService.delete(id);
  }
}

