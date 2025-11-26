import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// This defines the structure of a Todo document in MongoDB
@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  description: string;
}

// Create the schema for MongoDB
export const TodoSchema = SchemaFactory.createForClass(Todo);

