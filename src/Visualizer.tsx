import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  enumerateAncients,
  toContinuedFraction,
} from "./lib/continued_fraction";
import { type Fraction, parseFraction } from "./lib/parse";

interface PathSetting {
  first: number;
  last: number;
  insert: boolean;
}

type SettingStore = {
  path: PathSetting;
  setPath: (newSetting: PathSetting) => void;
};
const useSettingStore = create<SettingStore>()(
  persist(
    (set, _get) => ({
      path: {
        first: 1,
        last: 2,
        insert: false,
      },
      setPath: (newSetting: PathSetting) => set({ path: newSetting }),
    }),
    {
      name: "visualizer-setting-storage",
    },
  ),
);

/**
 * `n` を下から3桁ごとに空白を入れた文字列にする
 * @param n 数値
 * @returns 空白を入れた文字列
 */
const insertSpace = (n: bigint, insert: boolean) => {
  const s = `${n}`;
  const q = Math.floor(s.length / 3);
  const r = s.length - q * 3;
  if (!insert || s.length <= 3) return s;
  const head = s.slice(0, r);
  const tail = Array.from({ length: q }, (_, i) =>
    s.slice(r + i * 3, r + (i + 1) * 3),
  ).join(" ");
  return r === 0 ? tail : `${head} ${tail}`;
};
const formatApproximant = (f: Fraction | string, insert: boolean) => {
  return typeof f === "string"
    ? f
    : `${insertSpace(f.num, insert)} / ${insertSpace(f.den, insert)}`;
};

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

  const { first, last, insert } = useSettingStore((state) => state.path);
  const {
    cf: [integer, ...rest],
  } = toContinuedFraction(frac);
  const rows = enumerateAncients({
    frac,
    first: BigInt(first),
    last: BigInt(last),
  });
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
      <p style={{ textAlign: "center", overflowWrap: "break-word" }}>
        {formatApproximant(frac, insert)} = [{integer}
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
                {formatApproximant({ num: 0n, den: 1n }, insert)}
              </TableCell>
              <TableCell align="center">
                {formatApproximant({ num: 1n, den: 0n }, insert)}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {"center" in row ? (
                  <TableCell align="center" colSpan={2}>
                    {formatApproximant(row.center, insert)}
                  </TableCell>
                ) : (
                  <>
                    <TableCell align="center">
                      {"left" in row && formatApproximant(row.left, insert)}
                    </TableCell>
                    <TableCell align="center">
                      {"right" in row && formatApproximant(row.right, insert)}
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

export const Setting = () => {
  const { path, setPath } = useSettingStore();
  const handleChangeFirst = (_event: Event, newValue: number) => {
    setPath({ ...path, first: newValue });
  };
  const handleChangeLast = (_event: Event, newValue: number) => {
    setPath({ ...path, last: newValue });
  };
  const handleChangeInsert = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPath({ ...path, insert: event.target.checked });
  };
  return (
    <>
      <h2>Path Setting</h2>
      <FormGroup sx={{ width: "50%" }}>
        <Typography gutterBottom>
          Show first {path.first} row{path.first > 1 && "s"}
        </Typography>
        <Slider min={1} value={path.first} onChange={handleChangeFirst} />
        <Typography gutterBottom>Show last {path.last} rows</Typography>
        <Slider min={2} value={path.last} onChange={handleChangeLast} />
        <FormControlLabel
          control={
            <Switch checked={path.insert} onChange={handleChangeInsert} />
          }
          label="Insert digit separators"
        />
      </FormGroup>
    </>
  );
};
