const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 840,
    resizable: true,
    maximizable: true,
    fullscreen: false,
    icon: path.join(__dirname, "..", "public", "logo.png"),
    backgroundColor: "#f5e8c6",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.setMenu(null);
  Menu.setApplicationMenu(null);

  if (app.isPackaged) {
    win.loadFile(path.join(app.getAppPath(), "out", "index.html"));
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown" && input.key === "F11") {
      event.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
    if (input.type === "keyDown" && input.key === "F12") {
      event.preventDefault();
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools();
      } else {
        win.webContents.openDevTools({ mode: "detach" });
      }
    }
    if (input.type === "keyDown" && input.key === "F5") {
      event.preventDefault();
      win.reload();
    }
  });
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
