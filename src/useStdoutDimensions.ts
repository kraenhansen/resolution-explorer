import { useEffect, useState } from "react";
import { useStdout } from "ink";

// This file is heavily inspired by https://github.com/cameronhunter/ink-monorepo/blob/master/packages/ink-use-stdout-dimensions/src/index.ts

export type Dimensions = {
  columns: number;
  rows: number;
};

export function useStdoutDimensions() {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<Dimensions>({
    columns: stdout.columns,
    rows: stdout.rows,
  });

  useEffect(() => {
    const handler = () =>
      setDimensions({
        columns: stdout.columns,
        rows: stdout.rows,
      });
    stdout.on("resize", handler);
    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return dimensions;
}
