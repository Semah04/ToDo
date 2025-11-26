/**
 * todo.service.ts - Business Logic Layer for Todo Operations
 * 
 * This service contains all the business logic for Todo CRUD operations.
 * It acts as an intermediary between the controller (HTTP layer) and the database.
 * 
 * Responsibilities:
 * - Performs all database operations (Create, Read, Update, Delete)
 * - Validates data before saving to database
 * - Handles database queries and mutations
 * - Returns data in the format expected by controllers
 * 
 * Key Concept: Service Pattern
 * - Separates business logic from HTTP concerns (controllers)
 * - Makes code reusable and testable
 * - Allows multiple controllers to use the same service methods
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

/**
 * @Injectable Decorator
 * Makes this class available for dependency injection in NestJS
 * When TodoService is needed, NestJS will automatically create an instance
 */
@Injectable()
export class TodoService {
  /**
   * Constructor - Dependency Injection
   * 
   * @InjectModel(Todo.name) - Injects the Todo model from MongoDB
   * - Todo.name returns "Todo" as a string
   * - This connects to the Todo collection in MongoDB
   * - private todoModel: Makes the model available as a class property
   * 
   * The Model<Todo> type provides all MongoDB query methods like:
   * - find(), findById(), findOne(), create(), update(), delete(), etc.
   */
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  /**
   * create() - Creates a new todo in the database
   * 
   * @param createTodoDto - Data Transfer Object containing todo information
   *   - title: string (required) - The todo task title
   *   - description?: string (optional) - Additional details
   * 
   * @returns Promise<Todo> - The newly created todo document with MongoDB-generated _id
   * 
   * Flow:
   * 1. Creates a new Todo document instance from the provided data
   * 2. Saves it to MongoDB (inserts into the 'todos' collection)
   * 3. Returns the saved document (includes _id, createdAt, updatedAt)
   */
  async create(createTodoDto: { title: string; description?: string }): Promise<Todo> {
    // Create a new document instance (not saved yet)
    const createdTodo = new this.todoModel(createTodoDto);
    
    // Save to database and return the saved document
    // .save() validates the data against the schema before saving
    return createdTodo.save();
  }

  /**
   * findAll() - Retrieves all todos from the database
   * 
   * @returns Promise<Todo[]> - Array of all todo documents
   * 
   * Flow:
   * 1. Queries MongoDB for all documents in the 'todos' collection
   * 2. .exec() executes the query and returns a Promise
   * 3. Returns array of todos, empty array if none exist
   */
  async findAll(): Promise<Todo[]> {
    // .find() with no parameters returns all documents
    // .exec() executes the query and returns a Promise
    return this.todoModel.find().exec();
  }

  /**
   * findOne() - Retrieves a single todo by its ID
   * 
   * @param id - The MongoDB _id of the todo to find (string)
   * @returns Promise<Todo> - The todo document, or null if not found
   * 
   * Flow:
   * 1. Searches for a document with the matching _id
   * 2. Returns the document if found, null otherwise
   */
  async findOne(id: string): Promise<Todo> {
    // .findById() is a shorthand for .find({ _id: id })
    // MongoDB _id is automatically indexed for fast lookups
    return this.todoModel.findById(id).exec();
  }

  /**
   * update() - Updates an existing todo
   * 
   * @param id - The MongoDB _id of the todo to update
   * @param updateTodoDto - Partial object containing fields to update
   *   - title?: string (optional) - New title
   *   - completed?: boolean (optional) - New completion status
   *   - description?: string (optional) - New description
   * 
   * @returns Promise<Todo> - The updated todo document
   * 
   * Flow:
   * 1. Finds the document by ID
   * 2. Updates only the provided fields (partial update)
   * 3. { new: true } returns the updated document instead of the old one
   * 4. Automatically updates the updatedAt timestamp
   */
  async update(
    id: string,
    updateTodoDto: { title?: string; completed?: boolean; description?: string },
  ): Promise<Todo> {
    // .findByIdAndUpdate() atomically finds and updates in one operation
    // { new: true } - returns the updated document (default returns old document)
    // This is a partial update - only provided fields are changed
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true }).exec();
  }

  /**
   * delete() - Removes a todo from the database
   * 
   * @param id - The MongoDB _id of the todo to delete
   * @returns Promise<Todo> - The deleted todo document, or null if not found
   * 
   * Flow:
   * 1. Finds the document by ID
   * 2. Permanently removes it from the database
   * 3. Returns the deleted document (before deletion) for confirmation
   */
  async delete(id: string): Promise<Todo> {
    // .findByIdAndDelete() atomically finds and deletes in one operation
    // Returns the deleted document, or null if document doesn't exist
    return this.todoModel.findByIdAndDelete(id).exec();
  }
}

