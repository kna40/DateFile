const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  dialog,
  shell,
  Menu,
} = require("electron");
const fs = require("fs");
const { isSameDay } = require("date-fns");

nativeTheme.themeSource = "dark";
try {
  require("electron-reloader")(module);
} catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:3000");

  ipcMain.on(
    "submitted",
    (event, { filePath, directoryPath, selectedChip }) => {
      filePath = filePath.toString();
      if (filePath && filePath.length > 0) {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error("Error retrieving file stats:", err);
            return;
          }

          const dateModified = stats.mtime; // Date modified
          const dateCreated = stats.birthtime; // Date created

          if (directoryPath && directoryPath.length > 0) {
            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.error("Error reading directory:", err);
                return;
              }
              const filesData = [];
              // Iterate over the files
              files.forEach((file) => {
                const filePath = `${directoryPath}/${file}`;
                fs.stat(filePath, (err, stats) => {
                  if (err) {
                    console.error(
                      `Error retrieving stats for file ${filePath}:`,
                      err
                    );
                    return;
                  }
                  const fileDateModified = stats.mtime;
                  const fileDateCreated = stats.birthtime;
                  switch (selectedChip) {
                    case "Date Modified":
                      if (isSameDay(dateModified, fileDateModified)) {
                        const fileData = {
                          fileName: file,
                          stats: stats,
                        };

                        filesData.push(fileData);
                      }
                      break;
                    case "Date Created":
                      if (isSameDay(dateCreated, fileDateCreated)) {
                        const fileData = {
                          fileName: file,
                          stats: stats,
                        };

                        filesData.push(fileData);
                      }
                      break;
                    default:
                      if (isSameDay(dateModified, fileDateModified)) {
                        const fileData = {
                          fileName: file,
                          stats: stats,
                        };

                        filesData.push(fileData);
                      }
                      break;
                  }
                  // Check if all file data has been collected
                  //if (filesData.length === files.length) {
                  // Send the files data to the renderer process
                  win.webContents.send("directory-files", filesData);
                  //}
                });
              });
            });
            console.log("Selected directory paths:", directoryPath);
          }
        });
      }
    }
  );

  ipcMain.on("open-file-selection", (event) => {
    const options = {
      /* file selection dialog options */
    };
    //var filePath = "";
    dialog.showOpenDialog(win, options).then((result) => {
      const filePaths = result.filePaths;
      if (filePaths && filePaths.length > 0) {
        event.reply("setFilePath", filePaths);
        console.log("Selected file paths:", filePaths);
      }
    });
    //ipcMain.reply("setFilePath", filePath);
  });

  ipcMain.on("open-directory-selection", (event) => {
    const options = {
      properties: ["openDirectory"],
      /* additional directory selection dialog options if needed */
    };

    dialog.showOpenDialog(win, options).then((result) => {
      const directoryPath = result.filePaths[0];
      event.reply("setDirectoryPath", directoryPath);
    });
  });
  ipcMain.on("open-file-default", (event, filePath) => {
    //console.log(filePath);
    shell.openPath(filePath);
  });
  /*const contextMenu = new Menu();
  win.webContents.on("context-menu", (e, params) => {
    contextMenu.popup(win, params.x, params.y);
  });*/
  ipcMain.on("open-file-location", (event, filePath) => {
    //console.log(filePath);
    shell.showItemInFolder(filePath);
    //shell.openPath(filePath);
  });
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
