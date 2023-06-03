const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1420,
        height: 960,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // preload: path.join(__dirname, 'preload.js'),
        },
    });

    // ipcMain.on('fetch-data', async (event, args) => {
    //     try {
    const response = axios.get('https://catfact.ninja/fact');
    response.then((res) => {
        console.log(res.data);
        win.loadFile('app/templates/index.html');
    });
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    // Create custom protocol for local media loading
    protocol.registerFileProtocol('media-loader', (request, callback) => {
        const url = request.url.replace('media-loader://', '');
        try {
            return callback(url);
        } catch (err) {
            console.error(error);
            return callback(404);
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

try {
    require('electron-reloader')(module);
} catch (_) {}
