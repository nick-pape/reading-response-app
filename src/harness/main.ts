const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
import { ReadingResponses } from "./api/ReadingResponses";
import { ReadingResponsesUtilities } from "./utilities/ReadingResponsesUtilities";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('dist/index.html')
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

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)

    createWindow();
    
    // MacOS doesn't close windows, so reopen if there isn't an existing one
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
