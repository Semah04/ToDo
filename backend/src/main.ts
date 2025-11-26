/**
 * main.ts - Application Entry Point
 * 
 * This file is the starting point of the NestJS application.
 * It bootstraps (starts) the application and configures global settings.
 * 
 * What happens when the app starts:
 * 1. Creates a NestJS application instance from AppModule
 * 2. Configures CORS (Cross-Origin Resource Sharing) to allow frontend requests
 * 3. Starts the HTTP server on the specified port
 * 4. Logs a success message when the server is ready
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

/**
 * bootstrap() - Async function that starts the NestJS application
 * This function must be called to start the server
 */
async function bootstrap() {
  // Create the NestJS application instance
  // This initializes all modules, controllers, and services defined in AppModule
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Get port from environment variables, or use default 3001
  const port = configService.get<number>('PORT') || 3001;

  // Get allowed CORS origins from environment variables
  // If not set, use default localhost ports
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3002',
  ];

  /**
   * Enable CORS (Cross-Origin Resource Sharing)
   * 
   * CORS is a security feature that controls which websites can make requests to this API.
   * Since our frontend runs on a different port (3000 or 3002), we need to allow those origins.
   * 
   * Configuration:
   * - origin: Array of allowed frontend URLs that can access this API
   * - methods: HTTP methods allowed (GET, POST, PUT, DELETE, etc.)
   * - credentials: Allows cookies and authentication headers to be sent
   */
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // All CRUD operations
    credentials: true, // Allow cookies/authentication
  });

  // Start the HTTP server and listen on the specified port
  await app.listen(port);

  // Log success message when server is ready
  console.log(`✅ Backend is running on http://localhost:${port}`);
  console.log(`📡 CORS enabled for: ${corsOrigins.join(', ')}`);
}

// Call bootstrap() to start the application
// This is the entry point - when you run "npm run start:dev", this function executes
bootstrap();

