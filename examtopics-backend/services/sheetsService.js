const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsHelper {
  constructor() {
    this.sheets = null;
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.initializationPromise = null;
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
    const sheets = await this.initialize();
    const row = [
      new Date().toISOString(),
      data.topicNumber,
      data.questionNumber,
      data.examId,
      data.reason,
      data.comment,
      data.user,
      data.url,
    ];
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: 'A:H',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [row] },
    }, { timeout: 5_000, retry: false });
    return response.data;
  }

  async testConnection({ signal } = {}) {
    try {
      const sheets = await this.initialize();
      const response = await sheets.spreadsheets.get({
        spreadsheetId: this.sheetId,
        fields: 'spreadsheetId',
      }, { signal, retry: false });
      return response.data?.spreadsheetId === this.sheetId;
    } catch {
      return false;
    }
  }
}

module.exports = new GoogleSheetsHelper();
