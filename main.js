const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  dialog,
  shell,
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
      //devTools: false, // Disable DevTools
      fullscreen: true, // Hide the top bar
    },
  });
  //win.removeMenu();
  win.loadURL("http://localhost:3000");

  ipcMain.on(
    "submitted",
    (event, { filePath, directoryPath, selectedChip }) => {
      filePath = filePath.toString();
      if (filePath && filePath.length > 0) {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error("Error retrieving file stats:", err);
            event.reply("file-not-found");
            return;
          }

          const dateModified = stats.mtime; // Date modified
          const dateCreated = stats.birthtime; // Date created

          if (directoryPath && directoryPath.length > 0) {
            fs.readdir(directoryPath, async (err, files) => {
              if (err) {
                console.error("Error reading directory:", err);
                event.reply("directory-not-found");
                return;
              }
              const chunkSize = 50; // Define the chunk size for loading files
              let fileIndex = 0;

              // Send file chunks to the renderer process
              while (fileIndex < files.length) {
                const chunk = files.slice(fileIndex, fileIndex + chunkSize);

                const filesData = await Promise.all(
                  chunk.map((file) => {
                    const filePath = `${directoryPath}/${file}`;
                    return new Promise((resolve, reject) => {
                      fs.stat(filePath, (err, stats) => {
                        if (err) {
                          console.error(
                            `Error retrieving stats for file ${filePath}:`,
                            err
                          );
                          reject(err);
                        } else {
                          const fileDateModified = stats.mtime;
                          const fileDateCreated = stats.birthtime;
                          switch (selectedChip) {
                            case "Date Modified":
                              if (isSameDay(dateModified, fileDateModified)) {
                                const fileData = {
                                  fileName: file,
                                  stats: stats,
                                };
                                resolve(fileData);
                              } else {
                                resolve(null);
                              }
                              break;
                            case "Date Created":
                              if (isSameDay(dateCreated, fileDateCreated)) {
                                const fileData = {
                                  fileName: file,
                                  stats: stats,
                                };
                                resolve(fileData);
                              } else {
                                resolve(null);
                              }
                              break;
                            default:
                              if (isSameDay(dateModified, fileDateModified)) {
                                const fileData = {
                                  fileName: file,
                                  stats: stats,
                                };
                                resolve(fileData);
                              } else {
                                resolve(null);
                              }
                              break;
                          }
                        }
                      });
                    });
                  })
                );

                // Filter out null values (files that didn't match the selected chip)
                const filteredFilesData = filesData.filter(
                  (fileData) => fileData !== null
                );

                event.reply("directory-files-chunk", filteredFilesData);

                fileIndex += chunkSize;
              }

              event.reply("directory-files-end"); // Signal the end of file loading
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
