const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const apiKey = '<YOUR_API_KEY>';
const questionsCount = 2;

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
           const response = await axios.get(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${questionsCount}`);
            // questionsArr = [
            //     {
            //         id: 1,
            //         question: 'How to delete a directory in Linux?',
            //         description:
            //             'The rmdir commands deletes only empty directories. To delete a folder recursively use the rm -rf command.',
            //         answers: {
            //             answer_a: 'ls',
            //             answer_b: 'delete',
            //             answer_c: 'remove',
            //             answer_d: 'rmdir',
            //             answer_e: null,
            //             answer_f: null,
            //         },
            //         multiple_correct_answers: 'false',
            //         correct_answers: {
            //             answer_a_correct: 'false',
            //             answer_b_correct: 'false',
            //             answer_c_correct: 'false',
            //             answer_d_correct: 'true',
            //             answer_e_correct: 'false',
            //             answer_f_correct: 'false',
            //         },
            //         correct_answer: 'answer_d',
            //         explanation: 'rmdir deletes an empty directory',
            //         tip: null,
            //         tags: [],
            //         category: 'Linux',
            //         difficulty: 'Easy',
            //     },
            //     {
            //         id: 957,
            //         question: 'At its core, Kubernetes is a platform for:',
            //         description: null,
            //         answers: {
            //             answer_a:
            //                 'Provisioning machines (similar to Puppet, Ansible)',
            //             answer_b:
            //                 'Running and scheduling container applications on a cluster',
            //             answer_c: 'Packaging software in containers',
            //             answer_d: null,
            //             answer_e: null,
            //             answer_f: null,
            //         },
            //         multiple_correct_answers: 'false',
            //         correct_answers: {
            //             answer_a_correct: 'false',
            //             answer_b_correct: 'true',
            //             answer_c_correct: 'false',
            //             answer_d_correct: 'false',
            //             answer_e_correct: 'false',
            //             answer_f_correct: 'false',
            //         },
            //         correct_answer: null,
            //         explanation: null,
            //         tip: null,
            //         tags: [
            //             {
            //                 name: 'Kubernetes',
            //             },
            //         ],
            //         category: 'DevOps',
            //         difficulty: 'Easy',
            //     },
            // ];
            
            event.reply('fetch-data-response', response.data);
            //     });
            // });
            // request.on('finish', () => {
            //     console.log('Request is Finished')
            // });
            // request.on('abort', () => {
            //     console.log('Request is Aborted')
            // });
            // request.on('error', (error) => {
            //     console.log(`ERROR: ${JSON.stringify(error)}`)
            // });
            // request.on('close', (error) => {
            //     console.log('Last Transaction has occurred')
            // });
            // request.setHeader('Content-Type', 'application/json');
            // request.end();
        } catch (error) {

            console.log(error);
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
