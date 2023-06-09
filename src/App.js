import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { red } from "@mui/material/colors";

import MainUI from "./components/MainUI";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  //const [mode, setMode] = React.useState(prefersDarkMode ? "dark" : "light");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#ffffff" : "#1E1E1E",
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
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: "1 0 auto", overflow: "hidden" }}>
            <MainUI></MainUI>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
