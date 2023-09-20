const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('getVersions', () => {
  return {
    chrome: process.versions.chrome,
    node: process.versions.node,
    electron: process.versions.electron
  };
});