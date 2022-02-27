// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, contextBridge, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    transparent: true,
    frame: false,
    resizable: true,
    maximizable:false,
    minWidth:700,
    minHeight:500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true,
      contextIsolation:false,
      contextBridge:true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.menuBarVisible=false;
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
ipcMain.on('CerrarAplicacion', () => {
  BrowserWindow.getAllWindows().forEach((ventana)=>{
    ventana.close();
  });
});
ipcMain.on('MinimizarAplicacion', () => {
  BrowserWindow.getAllWindows().forEach((ventana)=>{
    ventana.minimize();
  });
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.