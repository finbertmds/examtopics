const mongoose = require('mongoose');

class DatabaseService {
  async testConnection() {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return false;
    }

    try {
      const result = await mongoose.connection.db.command({ ping: 1 });
      return result.ok === 1;
    } catch (error) {
      console.error('MongoDB connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new DatabaseService();
