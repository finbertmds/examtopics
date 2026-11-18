const { logFailure } = require('../utils/requestFailure');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB connected');
    
    // Handle connection events
    mongoose.connection.on('error', () => logFailure('database.connection_error'));

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch {
    logFailure('database.connection_failed');
    process.exit(1);
  }
};

module.exports = connectDB;
