const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsHelper {
  constructor() {
    this.sheets = null;
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.initializationPromise = null;
    this.connectionCache = null;
  }

  async initialize() {
    if (this.sheets) return this.sheets;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY;
      this.sheetId = process.env.GOOGLE_SHEET_ID;

      if (!this.sheetId || !clientEmail || !privateKey) {
        throw new Error('Google Sheets credentials are not fully configured');
      }

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const authClient = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: authClient });
      return this.sheets;
    })();

    try {
      return await this.initializationPromise;
    } catch (error) {
      this.initializationPromise = null;
      throw error;
    }
  }

  async appendRow(data) {
    try {
      const sheets = await this.initialize();
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        data.topicNumber || '',
        data.questionNumber || '',
        data.examId || '',
        data.reason || '',
        data.comment || '',
        data.user || '',
        data.url || ''
      ];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'A:H', // Assuming columns A-H for timestamp, topicNumber, questionNumber, examId, reason, comment, user, url
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row]
        }
      });

      console.log('Row appended successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to append row to Google Sheets:', error.message);
      throw error;
    }
  }

  async testConnection({ force = false } = {}) {
    const now = Date.now();
    if (!force && this.connectionCache && now - this.connectionCache.checkedAt < 60_000) {
      return this.connectionCache.connected;
    }

    try {
      const sheets = await this.initialize();
      const response = await sheets.spreadsheets.get({
        spreadsheetId: this.sheetId,
        fields: 'spreadsheetId',
      });
      const connected = response.data?.spreadsheetId === this.sheetId;
      this.connectionCache = { connected, checkedAt: now };
      return connected;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error.message);
      this.connectionCache = { connected: false, checkedAt: now };
      return false;
    }
  }
}

module.exports = new GoogleSheetsHelper();
