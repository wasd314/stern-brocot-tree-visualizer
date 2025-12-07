import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { type SyntheticEvent, useRef, useState } from "react";
import {
  enumerateAncients,
  toContinuedFraction,
} from "./lib/continued_fraction";
import { type Fraction, parseFraction } from "./lib/parse";

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

export const Visualizer = () => {
  const [frac, setFrac] = useState<Fraction>({ num: 1n, den: 1n });
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (!inputRef.current) return;
    const parsed = parseFraction(inputRef.current.value);
    if (!parsed) return;
    const { gcd } = toContinuedFraction(parsed);
    setFrac({ num: parsed.num / gcd, den: parsed.den / gcd });
  };
  const [first, last] = [1n, 2n];
  const {
    cf: [integer, ...rest],
  } = toContinuedFraction(frac);
  const rows = enumerateAncients({ frac, first, last });
  const formatApproximant = (f: Fraction | string) => {
    return typeof f === "string" ? f : `${f.num} / ${f.den}`;
  };
  return (
    <>
      <Stack spacing={2} direction="row">
        <TextField
          fullWidth
          inputRef={inputRef}
          label="Rational number"
          variant="outlined"
          defaultValue="1.23e4 / 567"
        />
        <Button onClick={handleClick} variant="outlined">
          Show
        </Button>
      </Stack>
      <p>
        {formatApproximant(frac)} = [{integer}
        {rest.length > 0 && "; " + rest.join(", ")}]
      </p>
      <TableContainer component={Paper}>
        <Table
          // sx={{ minWidth: 650 }}
          size="small"
          aria-label="best approximants"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                Best Approximant
              </TableCell>
              <TableCell align="center">Depth</TableCell>
              <TableCell align="center" colSpan={2}>
                Run
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Lower</TableCell>
              <TableCell align="center">Upper</TableCell>
              <TableCell />
              <TableCell align="center">Left</TableCell>
              <TableCell align="center">Right</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                {formatApproximant({ num: 0n, den: 1n })}
              </TableCell>
              <TableCell align="center">
                {formatApproximant({ num: 1n, den: 0n })}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {"center" in row ? (
                  <TableCell align="center" colSpan={2}>
                    {formatApproximant(row.center)}
                  </TableCell>
                ) : (
                  <>
                    <TableCell align="center">
                      {"left" in row && formatApproximant(row.left)}
                    </TableCell>
                    <TableCell align="center">
                      {"right" in row && formatApproximant(row.right)}
                    </TableCell>
                  </>
                )}
                <TableCell align="center">{row.depth}</TableCell>
                <TableCell align="center">
                  {"leftIndex" in row && row.leftIndex}
                </TableCell>
                <TableCell align="center">
                  {"rightIndex" in row && row.rightIndex}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const Container = () => {
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
};
export default Container;
