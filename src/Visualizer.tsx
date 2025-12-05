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
  return (
    <div>
      <div>
        <input type="text" ref={inputRef} />
        <button onClick={handleClick}>Show</button>
      </div>
      <div>
        {frac.num} / {frac.den} = [{integer}
        {rest.length > 0 && "; " + rest.join(", ")}]
      </div>
      <TableContainer>
        <Table
          // sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                Approximant
              </TableCell>
              <TableCell align="center">Depth</TableCell>
              <TableCell align="center">Left desc</TableCell>
              <TableCell align="center">Right desc</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">0/1</TableCell>
              <TableCell align="center">1/0</TableCell>
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
                    {`${row.center.num}/${row.center.den}`}
                  </TableCell>
                ) : (
                  <>
                    <TableCell align="center">
                      {"left" in row &&
                        typeof row.left !== "string" &&
                        `${row.left.num}/${row.left.den}`}
                      {"left" in row &&
                        typeof row.left === "string" &&
                        row.left}
                    </TableCell>
                    <TableCell align="center">
                      {"right" in row &&
                        typeof row.right !== "string" &&
                        `${row.right.num}/${row.right.den}`}
                      {"right" in row &&
                        typeof row.right === "string" &&
                        row.right}
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
    </div>
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
