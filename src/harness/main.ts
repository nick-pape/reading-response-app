import { app, BrowserWindow, dialog, ipcMain } from 'electron';
const path = require('path');
import { ReadingResponses } from "./api/ReadingResponses";
import { ReadingResponsesUtilities } from "./utilities/ReadingResponsesUtilities";

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.removeMenu();
    win.setTitle("RL Reading Response Grader")
    await win.loadFile('dist/index.html')
}

// Close the app when all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


async function handleFileOpen(): Promise<ReadingResponses | undefined> {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return ReadingResponsesUtilities.fromDumpFile(filePaths[0]);
    }
}

async function initialize() {
    await app.whenReady();

    ipcMain.handle('dialog:openFile', handleFileOpen)

    await createWindow();
    
    // MacOS doesn't close windows, so reopen if there isn't an existing one
    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
}

initialize().then(() => {
    console.log("Started up the app.")
}).catch((err) => {
    console.log(`Issue starting the app: ${err}`)
})
