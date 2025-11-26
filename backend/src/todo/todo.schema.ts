/**
 * todo.schema.ts - MongoDB Schema Definition for Todo Model
 * 
 * This file defines the structure (schema) of a Todo document in MongoDB.
 * Think of it as a blueprint that describes what a Todo item looks like in the database.
 * 
 * Key Concepts:
 * - Schema: Defines the structure and validation rules for documents
 * - Document: A single record/row in MongoDB (like a single todo item)
 * - Model: A class that represents a collection and provides methods to interact with it
 * 
 * Each Todo document will have:
 * - _id: Automatically generated unique identifier (MongoDB creates this)
 * - title: Required string field - the main todo task
 * - completed: Boolean flag indicating if todo is done (defaults to false)
 * - description: Optional string field - additional details about the todo
 * - createdAt: Automatically added timestamp when document is created
 * - updatedAt: Automatically updated timestamp when document is modified
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @Schema Decorator
 * - timestamps: true automatically adds createdAt and updatedAt fields
 *   These fields are managed by MongoDB and update automatically
 * - collection: 'todos' explicitly sets the MongoDB collection name
 *   Without this, Mongoose would automatically pluralize "Todo" to "todos"
 *   Being explicit makes it clearer where data is stored
 */
@Schema({ 
  timestamps: true,
  collection: 'todos' // Explicitly set collection name to 'todos'
})
export class Todo extends Document {
  /**
   * @Prop Decorator
   * - required: true means this field must be provided when creating a todo
   * - If you try to create a todo without a title, MongoDB will reject it
   */
  @Prop({ required: true })
  title: string;

  /**
   * @Prop Decorator
   * - default: false means if no value is provided, it will default to false
   * - This allows todos to be created without explicitly setting completed status
   */
  @Prop({ default: false })
  completed: boolean;

  /**
   * @Prop Decorator
   * - No options means this field is optional
   * - If not provided, the field will be undefined or omitted from the document
   */
  @Prop()
  description: string;

  // Note: _id, createdAt, and updatedAt are automatically added by MongoDB
  // You don't need to define them here, they're managed by the database
}

/**
 * TodoSchema - The actual Mongoose schema object
 * 
 * This is what gets registered with MongoDB.
 * It's created from the Todo class using SchemaFactory.
 * 
 * Usage: This schema is used in todo.module.ts to register the Todo model
 * with MongoDB, allowing us to create, read, update, and delete Todo documents.
 */
export const TodoSchema = SchemaFactory.createForClass(Todo);

