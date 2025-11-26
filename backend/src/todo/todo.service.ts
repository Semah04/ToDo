import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
  // Inject the Todo model to interact with MongoDB
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  // Create a new todo
  async create(createTodoDto: { title: string; description?: string }): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  // Get all todos
  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  // Get a single todo by ID
  async findOne(id: string): Promise<Todo> {
    return this.todoModel.findById(id).exec();
  }

  // Update a todo
  async update(id: string, updateTodoDto: { title?: string; completed?: boolean; description?: string }): Promise<Todo> {
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true }).exec();
  }

  // Delete a todo
  async delete(id: string): Promise<Todo> {
    return this.todoModel.findByIdAndDelete(id).exec();
  }
}

