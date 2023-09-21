import { IGradebook } from "./api/Gradebook";

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
  // return ReadingResponses.fromDumpFile('C:\\Users\\nickp\\Downloads\\responses_1.txt'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveGrades: (grades: IGradebook) => ipcRenderer.invoke('event:saveGrades', grades)
});

export {};