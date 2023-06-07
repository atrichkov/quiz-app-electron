const { app, BrowserWindow, protocol, ipcMain, screen } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const apiKey = '<YOUR_API_KEY>';
const questionsCount = 5;

const createWindow = (width, height) => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: Number(((75 / 100) * width).toFixed()),
    height: Number(((75 / 100) * height).toFixed()),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, './renderer/pages/index.html'));
  ipcMain.on('fetch-data', async (event, args) => {
    try {
      let questionsArr;
      if (isDev) {
        // use dummy data to save api calls
        const data = fs.readFileSync('./tests/data.json', {
          encoding: 'utf8',
          flag: 'r',
        });
        questionsArr = JSON.parse(data);
      } else {
        const response = await axios.get(
          `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${questionsCount}`,
        );
        questionsArr = response.data;
      }

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
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  createWindow(width, height);

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
