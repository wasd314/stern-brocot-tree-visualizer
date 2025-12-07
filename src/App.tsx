import { type SyntheticEvent, useState } from "react";
import Visualizer from "./Visualizer";
import "./App.css";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  const [value, setValue] = useState("1");

  const handleValue = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleValue} aria-label="function selection">
              <Tab label="Path" value="1" />
              <Tab label="Settings" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" keepMounted>
            <Visualizer />
          </TabPanel>
          <TabPanel value="2"></TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
}

export default App;
