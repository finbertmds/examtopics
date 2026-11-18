const mongoose = require('mongoose');

class DatabaseService {
  async testConnection({ signal } = {}) {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return false;
    }

    try {
      const result = await mongoose.connection.db.command({ ping: 1 }, { signal });
      return result.ok === 1;
    } catch {
      return false;
    }
  }
}

module.exports = new DatabaseService();
