import path from "node:path";
import chalk from "chalk";

import { Resolution } from "./TraceParser.js";

export function getResolutionLabel(
  resolution: Resolution,
  highlighter: (text: string) => string = (text) => text
) {
  return [
    chalk.dim(`[${resolution.index}]`),
    highlighter(resolution.target),
    chalk.dim("from"),
    highlighter(path.relative(process.cwd(), resolution.from)),
    ...(resolution.to
      ? [
          chalk.dim("to"),
          highlighter(path.relative(process.cwd(), resolution.to)),
        ]
      : resolution.state === "failed"
        ? ["🔴"]
        : []),
  ].join(" ");
}
