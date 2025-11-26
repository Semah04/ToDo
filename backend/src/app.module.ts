import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    // Connect to MongoDB - default connection string for local MongoDB
    // Change this to your MongoDB connection string
    MongooseModule.forRoot('mongodb://localhost:27017/todoapp'),
    TodoModule,
  ],
})
export class AppModule {}

