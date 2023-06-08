import * as React from "react";
import {
  TextField,
  Box,
  Grid,
  IconButton,
  Divider,
  Card,
  ListItem,
  ListItemText,
  CardContent,
  Button,
  Chip,
  MenuItem,
  Menu,
  ListItemIcon,
  Skeleton,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FolderIcon from "@mui/icons-material/Folder";
import { styled } from "@mui/system";
import { InsertDriveFile, FileCopy } from "@mui/icons-material";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
const StyledMenu = styled(Menu)(({ theme }) => ({
  //border: "1px solid #d3d4d5",
  borderRadius: "4px",
  marginTop: "8px",
  minWidth: "180px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&:hover": {
    //backgroundColor: theme.palette.primary.main,
    //color: theme.palette.primary.contrastText,
  },
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  fontSize: theme.typography.fontSize,
}));

const StyledContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  overflow: "hidden",
});

const StyledCard = styled(Card)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  margin: "10px 20px 20px 20px",
});

const ScrollableCardContent = styled(CardContent)({
  flex: 1,
  overflow: "auto",
  maxHeight: "calc(100vh - 250px)", // Adjust the value as needed
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
});
const ListStyle = styled(List)({
  flex: 1,
  overflow: "auto",
  maxHeight: "calc(100vh - 250px)", // Adjust the value as needed
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
});

const { ipcRenderer } = window.require("electron");
const MainUI = () => {
  const [filePath, setFilePath] = React.useState("");

  const handleFileSelection = () => {
    ipcRenderer.send("open-file-selection");
  };
  const handleDirectorySelection = () => {
    ipcRenderer.send("open-directory-selection");
  };
  const [dFileNames, setDFileNames] = React.useState([]);
  const [emptyReturnedDFiles, setEmptyReturnedDFiles] = React.useState(false);
  const [directoryPath, setDirectoryPath] = React.useState("");
  React.useEffect(() => {
    ipcRenderer.on("directory-files-chunk", (event, filesData) => {
      // Update the state with the received file data
      setDFileNames((prevFileNames) => [...prevFileNames, ...filesData]);
    });

    return () => {
      ipcRenderer.removeAllListeners("directory-files-chunk");
    };
  }, []);
  React.useEffect(() => {
    ipcRenderer.on("directory-files-end", () => {
      setIsLoading(false);
    });

    return () => {
      ipcRenderer.removeAllListeners("directory-files-end");
    };
  }, []);
  React.useEffect(() => {
    //ipcRenderer.send("get-directory-files" /* directory path */);
    ipcRenderer.on("setFilePath", (event, filePaths) => {
      setFilePath(filePaths);
    });

    return () => {
      ipcRenderer.removeAllListeners("directory-files");
    };
  }, []);
  React.useEffect(() => {
    //ipcRenderer.send("get-directory-files" /* directory path */);
    ipcRenderer.on("setDirectoryPath", (event, directoryPath) => {
      setDirectoryPath(directoryPath);
    });

    return () => {
      ipcRenderer.removeAllListeners("directory-files");
    };
  }, []);
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFilePath(file.path);
    //const filePath = file.path;
    //const textBox = document.getElementById("source-file");
    //textBox.value = filePath;
  };

  const [selectedChip, setSelectedChip] = React.useState("Date Modified");
  const [sourceFileError, setSourceFileError] = React.useState(false);
  const [directoryError, setDirectoryError] = React.useState(false);
  const handleChipClick = (label) => {
    setSelectedChip(label);
  };
  /*const onSubmit = () => {
    if (filePath.length === 0 && directoryPath.length === 0) {
      setSourceFileError(true);
      setDirectoryError(true);
      return;
    }

    if (filePath.length === 0) {
      setSourceFileError(true);
      return;
    }

    if (directoryPath.length === 0) {
      setDirectoryError(true);
      return;
    }

    ipcRenderer.send("submitted", {
      filePath,
      directoryPath,
      selectedChip,
    });
  };*/
  // Set the chunk size for reading files

  // Function to read files in chunks

  const onSubmit = async () => {
    if (filePath.length === 0 && directoryPath.length === 0) {
      setSourceFileError(true);
      setDirectoryError(true);
      return;
    }

    if (filePath.length === 0) {
      setSourceFileError(true);
      return;
    }

    if (directoryPath.length === 0) {
      setDirectoryError(true);
      return;
    }

    setIsLoading(true); // Set the loading state to true
    setDFileNames([]);
    // Use a try-catch block to handle any errors that may occur during file reading
    try {
      // Perform the file reading process
      ipcRenderer.send("submitted", {
        filePath,
        directoryPath,
        selectedChip,
      });
    } catch (error) {
      // Handle the error appropriately (e.g., show an error message)
      console.error("Error reading files:", error);
    }
  };
  React.useEffect(() => {
    if (filePath.length > 0) {
      setSourceFileError(false);
    }
  }, [filePath]);

  React.useEffect(() => {
    if (directoryPath.length > 0) {
      setDirectoryError(false);
    }
  }, [directoryPath]);
  const convertTime = (timeString) => {
    const timeObject = new Date(timeString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return timeObject.toLocaleString(undefined, options);
  };
  /*const handleContextMenu = (event, fileName) => {
    console.log(directoryPath + "\\" + fileName);
    event.preventDefault();
    ipcRenderer.send("show-context-menu", directoryPath + "\\" + fileName);
  };*/
  const [contextMenu, setContextMenu] = React.useState(null);

  const handleContextMenu = (event, pathFile) => {
    event.preventDefault();
    if (event.type === "contextmenu") {
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        fileName: pathFile,
      });
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleFileOpen = (pathFile) => {
    ipcRenderer.send("open-file-default", directoryPath + "\\" + pathFile);
    setContextMenu(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        // You can optionally show a success message or perform other actions here
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
        // You can optionally show an error message or handle the error here
      });
  };
  const handleCopy = (pathFile) => {
    const path = directoryPath + "\\" + pathFile;
    copyToClipboard(path);
    setContextMenu(null);
  };
  const handleOpenLocation = (pathFile) => {
    ipcRenderer.send("open-file-location", directoryPath + "\\" + pathFile);
    setContextMenu(null);
  };
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <StyledContainer>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ m: "10px", overflow: "hidden" }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent={"center"}
        >
          <Grid item xs={12} display={"flex"} alignItems="center">
            <TextField
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: "10px",
                },
                "& .MuiFilledInput-input": {
                  borderRadius: "10px",
                },
                "& .MuiInputLabel-filled": {
                  borderRadius: "10px",
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                },
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onChange={(v) => setFilePath(v.target.value)}
              value={filePath}
              error={sourceFileError}
              id="source-file"
              label="Source File"
              variant="filled"
              fullWidth
              margin="dense"
            />
            <IconButton
              onClick={handleFileSelection}
              sx={{ width: "3rem", height: "3rem", borderRadius: "0.5rem" }}
            >
              <FileOpenIcon></FileOpenIcon>
            </IconButton>
          </Grid>
          <Grid item xs={12} display={"flex"} alignItems="center">
            <TextField
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: "10px",
                },
                "& .MuiFilledInput-input": {
                  borderRadius: "10px",
                },
                "& .MuiInputLabel-filled": {
                  borderRadius: "10px",
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                },
              }}
              id="target-directory"
              label="Target Directory"
              variant="filled"
              onChange={(v) => setDirectoryPath(v.target.value)}
              value={directoryPath}
              error={directoryError}
              fullWidth
              margin="dense"
            />
            <IconButton
              onClick={handleDirectorySelection}
              sx={{ width: "3rem", height: "3rem", borderRadius: "0.5rem" }}
            >
              <FolderIcon></FolderIcon>
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        display="grid"
        sx={{
          m: "10px 20px 0 20px",
          gridTemplateColumns: "1fr auto",
          gridTemplateAreas: `"chips button"`,
          gap: "8px",
        }}
      >
        <Box sx={{ gridArea: "chips" }}>
          <Chip
            label="Date Modified"
            sx={{ mr: "5px" }}
            onClick={() => handleChipClick("Date Modified")}
            variant={selectedChip === "Date Modified" ? "filled" : "outlined"}
            clickable
          />

          <Chip
            label="Date Created"
            sx={{ mr: "5px" }}
            onClick={() => handleChipClick("Date Created")}
            variant={selectedChip === "Date Created" ? "filled" : "outlined"}
            clickable
          />
        </Box>
        <Button
          sx={{
            width: "100px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            gridArea: "button",
            justifySelf: "flex-end",
            alignSelf: "flex-end",
          }}
          onClick={onSubmit}
        >
          Find
        </Button>
      </Box>
      <StyledCard>
        <ScrollableCardContent>
          {emptyReturnedDFiles ? (
            <div>
              <Typography variant="h6">No files found</Typography>
              <Typography variant="subtitle2">
                Try using a different date type
              </Typography>
            </div>
          ) : isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <div style={{ height, width }}>
                  <ListStyle
                    height={height}
                    width={width} // Use the width provided by AutoSizer
                    itemCount={dFileNames.length}
                    itemSize={80}
                  >
                    {({ index, style }) => {
                      const fileData = dFileNames[index];
                      return (
                        <div style={style}>
                          <ListItem
                            alignItems="center"
                            sx={{ display: "block" }}
                            divider
                            dense
                            item
                            key={index}
                            onContextMenu={(event) =>
                              handleContextMenu(event, fileData.fileName)
                            }
                            style={{ cursor: "context-menu" }}
                          >
                            <ListItemText
                              sx={{ mb: 0 }}
                              primary={`File Name: ${fileData.fileName}`}
                              secondary={`Date Modified: ${JSON.stringify(
                                convertTime(fileData.stats.mtime)
                              )}`}
                            />
                            <ListItemText
                              sx={{ mt: 0 }}
                              secondary={`Date Created: ${JSON.stringify(
                                convertTime(fileData.stats.birthtime)
                              )}`}
                            />
                            <StyledMenu
                              open={contextMenu !== null}
                              onClose={handleClose}
                              anchorReference="anchorPosition"
                              anchorPosition={
                                contextMenu !== null
                                  ? {
                                      top: contextMenu.mouseY,
                                      left: contextMenu.mouseX,
                                    }
                                  : undefined
                              }
                            >
                              <StyledMenuItem
                                onClick={() =>
                                  handleFileOpen(contextMenu.fileName)
                                }
                              >
                                <ListItemIcon>
                                  <InsertDriveFile />
                                </ListItemIcon>
                                Open file
                              </StyledMenuItem>
                              <StyledMenuItem
                                onClick={() => handleCopy(contextMenu.fileName)}
                              >
                                <ListItemIcon>
                                  <FileCopy />
                                </ListItemIcon>
                                Copy as path
                              </StyledMenuItem>
                              <StyledMenuItem
                                onClick={() =>
                                  handleOpenLocation(contextMenu.fileName)
                                }
                              >
                                <ListItemIcon>
                                  <FolderIcon />
                                </ListItemIcon>
                                Open file location
                              </StyledMenuItem>
                            </StyledMenu>
                          </ListItem>
                        </div>
                      );
                    }}
                  </ListStyle>
                </div>
              )}
            </AutoSizer>
          )}
        </ScrollableCardContent>
      </StyledCard>
    </StyledContainer>
  );
};

export default MainUI;
