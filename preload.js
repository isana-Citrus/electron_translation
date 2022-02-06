const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
    'api', {
    winquit: () => ipcRenderer.invoke("quit"),
    setlist: (data) => ipcRenderer.invoke("setlist", data),
    on_trans_exec: (func) => {
        ipcRenderer.on("trans_exec", (event, ...args) => func(...args));
    }
    //on: (channel, func) => {ipcRenderer.on(channel, (event, ...args) => func(...args));},

}); 
