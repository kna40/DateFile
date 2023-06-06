import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { red } from "@mui/material/colors";

import MainUI from "./components/MainUI";
import "./App.css";

const { ipcRenderer } = window.require("electron");

ipcRenderer.send("read-directory", "/path/to/directory");

ipcRenderer.on("read-directory-response", (event, response) => {
  if (response.error) {
    console.error("Error reading directory:", response.error);
  } else {
    const files = response.files;
    console.log("Files in directory:", files);
  }
});

const handleLocations = (fileLocation, directoryLocation) => {
  ipcRenderer.send("locations", { fileLocation, directoryLocation });
};

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  //const [mode, setMode] = React.useState(prefersDarkMode ? "dark" : "light");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          palette: {
            mode: prefersDarkMode ? "dark" : "light",
          },
          primary: {
            main: !prefersDarkMode ? "#ffffff" : "#1E1E1E",
          },
          secondary: {
            main: "#242424",
          },
          error: {
            main: red.A400,
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <MainUI></MainUI>
    </ThemeProvider>
  );
}

export default App;
