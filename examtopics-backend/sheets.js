const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsHelper {
  constructor() {
    this.sheets = null;
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.initialize();
  }

  async initialize() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('Google Sheets API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error.message);
      throw error;
    }
  }

  async appendRow(data) {
    if (!this.sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    if (!this.sheetId) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    try {
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        data.questionId || '',
        data.examId || '',
        data.reason || '',
        data.comment || '',
        data.user || ''
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'A:F', // Assuming columns A-F for timestamp, questionId, examId, reason, comment, user
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row]
        }
      });

      console.log('Row appended successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to append row to Google Sheets:', error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      if (!this.sheets || !this.sheetId) {
        return false;
      }

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.sheetId
      });

      return !!response.data;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new GoogleSheetsHelper();
