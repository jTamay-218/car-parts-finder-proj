#!/usr/bin/env node

import { testConnection } from './src/config/database.js';
import app from './src/server.js';

// Test database connection before starting server
async function startServer() {
  try {
    console.log('🔍 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.warn('⚠️  Database connection failed. Starting server in development mode without database.');
      console.log('💡 To use full functionality, please set up PostgreSQL database.');
    } else {
      console.log('✅ Database connection successful');
    }
    
    console.log('🚀 Starting Car Parts Finder API server...');
  } catch (error) {
    console.warn('⚠️  Database connection error:', error.message);
    console.log('💡 Starting server in development mode without database.');
    console.log('🚀 Starting Car Parts Finder API server...');
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
