const { app, BrowserWindow, nativeTheme } = require("electron");
const fs = require("fs");
const { ipcMain } = require("electron");
nativeTheme.themeSource = "dark";
try {
  require("electron-reloader")(module);
} catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const directoryPath = `C:\\Program Files (x86)\\Image-Line\\FL Studio 12\\Data\\Projects`;
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Iterate over the files
  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`;
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error retrieving stats for file ${filePath}:`, err);
        return;
      }
      //console.log("File:", file);
      //console.log("Date Modified:", stats.mtime);
      //console.log("Date Created:", stats.birthtime);
    });
  });
});

ipcMain.on("message-from-renderer", (event, arg) => {
  console.log("Message received in the main process:", arg);
  // Do something with the message
  // ...
  // Sending a response back to the renderer process
  event.sender.send("message-from-main", "Response from main process");
});

ipcMain.on("read-directory", (event, directoryPath) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      event.reply("read-directory-response", { error: err.message });
    } else {
      event.reply("read-directory-response", { files });
    }
  });
});
