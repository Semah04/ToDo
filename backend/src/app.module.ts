/**
 * AppModule - Root Module of the NestJS Application
 * 
 * This is the main module that imports and configures all other modules.
 * It acts as the entry point for the application's dependency injection system.
 * 
 * Key Responsibilities:
 * - Connects to MongoDB database using Mongoose
 * - Imports the TodoModule to make Todo features available
 * - Configures environment variables for database connection
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    // ConfigModule: Loads environment variables from .env file
    // This must be imported first so other modules can use ConfigService
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available to all modules without re-importing
      envFilePath: '.env', // Path to the .env file (located in backend/ folder)
    }),

    // MongooseModule: Connects to MongoDB database
    // Uses ConfigService to get MONGODB_URI from environment variables
    // If .env file doesn't exist, it falls back to the hardcoded connection string
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/todoapp',
      }),
      inject: [ConfigService],
    }),

    // TodoModule: Imports the Todo feature module
    // This makes all Todo controllers, services, and schemas available to the app
    TodoModule,
  ],
})
export class AppModule {}

