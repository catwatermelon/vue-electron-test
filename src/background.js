'use strict'

import { app, protocol, BrowserWindow, ipcMain, Notification, Tray, nativeImage, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.setAppUserModelId(`CatWatermelon ${app.getVersion()}`);





let win = null
let setting = null

const windowFactory = async (options) => {
  const { url = '', ...restOptions } = options;
  console.log(url);
  const newWindow = new BrowserWindow(Object.assign({
    width: 300,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true, // 是否在Web工作器中启用了Node集成
      contextIsolation: false, // electron为12x版本新增此行
      devTools: true, // 是否开启 DevTools
    }
  }, restOptions))

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    newWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/${url}`);
    if (!process.env.IS_TEST) newWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    newWindow.loadFile('./index.html', {
      hash: url
    });
  }
  return newWindow;
}

async function createWindow() {
  // Create the browser window.
  win = await windowFactory({
    height: 200,
    width: 200,
    transparent: true
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('create-window', async (e, args) => {
  const { windowName } = args;
  switch (windowName) {
    case 'setting':
      if (setting != null) return;
      setting = await windowFactory({
        url: windowName,
        height: 240,
        width: 340,
        transparent: true,
      })
      setting.on('closed', () => {
        setting = null;
      })
      break;
  }
})

ipcMain.on('send-notification', (e, { title, body }) => {
  const n = new Notification({
    title: `任务 ${title} 完成通知`,
    body,
  })
  n.show();
});

ipcMain.on('window-operate', (e, args) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (window == null) return;
  const { operate } = args;
  switch (operate) {
    case 'close':
      window.hide();
      window.destroy();
      break;
    case 'minimize':
      window.minimize();
      break;
  }
});

app.whenReady().then(() => {
  let appIcon = null
  appIcon = new Tray(nativeImage.createFromPath('./assets/logo.png'))
  appIcon.setToolTip('This is my application')
  appIcon.setTitle('This is my title')
})