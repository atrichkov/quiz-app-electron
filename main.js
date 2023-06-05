const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const apiKey = 'u8TylbMvsAhol0ktB6xeDv26OIY79ReS0n8pP65N';
const questionsCount = 5;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1420,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, './renderer/pages/index.html'));
  ipcMain.on('fetch-data', async (event, args) => {
    try {
      const response = await axios.get(
        `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${questionsCount}`,
      );
      const questionsArr = response.data;

      // debug
      // const data = fs.readFileSync('./tests/data.json', {
      //   encoding: 'utf8',
      //   flag: 'r',
      // });
      // const questionsArr = JSON.parse(data);

      event.reply('fetch-data-response', questionsArr);
    } catch (error) {
      console.error(error);
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

try {
  require('electron-reloader')(module);
} catch (_) {}
