import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import Button from "@mui/material/Button";
// import Input from "@mui/material/Input";
import { useRef, useState } from "react";
import { type Fraction, parseFraction } from "./lib/parse";
import "./Visualizer.css";
import Paper from "@mui/material/Paper";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  enumerateAncients,
  toContinuedFraction,
} from "./lib/continued_fraction";

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
        <Input fullWidth inputRef={inputRef} />
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
  return (
    <Tabs>
      <TabList>
        <Tab>Main</Tab>
        <Tab>Settings</Tab>
      </TabList>

      <TabPanel>
        <Visualizer />
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
  );
};
export default Container;
