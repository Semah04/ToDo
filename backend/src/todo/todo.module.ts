/**
 * todo.module.ts - Todo Feature Module
 * 
 * This module groups together all Todo-related components (controller, service, schema).
 * It's a feature module that encapsulates the Todo functionality.
 * 
 * Module Structure:
 * - imports: Other modules needed by this module
 * - controllers: HTTP request handlers (routes)
 * - providers: Services and other injectable classes
 * 
 * Key Concept: Modular Architecture
 * - Organizes code into logical, reusable units
 * - Each feature has its own module
 * - Modules can import other modules as needed
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo, TodoSchema } from './todo.schema';

/**
 * @Module Decorator
 * Defines this class as a NestJS module
 */
@Module({
  imports: [
    /**
     * MongooseModule.forFeature()
     * 
     * Registers the Todo schema with MongoDB so it can be used in TodoService.
     * This connects the Todo class to a MongoDB collection named 'todos'.
     * 
     * Configuration:
     * - name: Todo.name - Uses the class name "Todo" as the collection/model name
     * - schema: TodoSchema - The schema definition from todo.schema.ts
     * 
     * After this registration:
     * - A 'todos' collection is created in MongoDB (if it doesn't exist)
     * - TodoService can inject Model<Todo> using @InjectModel(Todo.name)
     * - All CRUD operations can be performed on the todos collection
     */
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],

  /**
   * controllers: Array of controller classes
   * 
   * Registers TodoController so NestJS knows to handle HTTP requests to its routes.
   * All routes defined in TodoController become available when this module is imported.
   */
  controllers: [TodoController],

  /**
   * providers: Array of service classes and other injectable providers
   * 
   * Registers TodoService so it can be injected into controllers and other services.
   * NestJS will create a single instance (singleton) of TodoService and share it
   * wherever it's needed via dependency injection.
   */
  providers: [TodoService],
})
export class TodoModule {}

