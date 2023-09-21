import { app, BrowserWindow, dialog, Event, ipcMain, shell } from 'electron';
const path = require('path');
import { ReadingResponses } from "./api/ReadingResponses";
import { ReadingResponsesUtilities } from "./utilities/ReadingResponsesUtilities";
import { Gradebook, IGradebook } from './api/Gradebook';
import { GradebookUtilities } from './utilities/GradebookUtilities';
import * as fs from 'fs';

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // win.removeMenu();
    win.setTitle("RL Reading Response Grader")
    await win.loadFile('dist/index.html')
}

// Close the app when all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

let responsesPath: string | undefined = undefined;
let gradebookPath: string | undefined = undefined;

async function handleSaveGradebook(_: Event, gradebook: IGradebook): Promise<void> {
    if (gradebookPath) {
        console.log(gradebook);

        fs.writeFileSync(gradebookPath, JSON.stringify({
            grades: Object.fromEntries(gradebook.grades)
        }, undefined, 2));
    }
}

async function handleFileOpen(): Promise<{
    responses: ReadingResponses | undefined,
    grades: Gradebook | undefined
}> {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
        responsesPath = filePaths[0];
        gradebookPath = `${filePaths[0]}.grades.json`;

        return {
            responses: ReadingResponsesUtilities.fromDumpFile(responsesPath),
            grades: GradebookUtilities.fromDumpFile(gradebookPath)
        };
    }
    return {
        responses: undefined,
        grades: undefined
    }
}

async function initialize() {
    await app.whenReady();

    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('event:saveGrades', handleSaveGradebook);

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
