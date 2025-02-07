import React from "react";

import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import * as path from "node:path";
import * as fs from "node:fs";
import { render, Text } from "ink";

import { Explorer } from "./Explorer.js";
import { TraceParser } from "./TraceParser.js";

export function run(args = hideBin(process.argv)) {
  yargs(args)
    .command(
      "$0 [trace]",
      "Explore a trace file",
      (yargs) =>
        yargs.positional("trace", {
          description:
            "The path of a trace file generated with --traceResolution",
          normalize: true,
          demandOption: false,
          coerce: (value) => path.resolve(value),
        }),
      async (args) => {
        const parser = new TraceParser();
        if (args.trace) {
          await parser.parseFile(args.trace);
        } else {
          throw new Error("Tracing from stdin is not supported yet");
        }
        render(<Explorer resolutions={parser.resolutions} />);
      }
    )
    .parseAsync()
    .catch(console.error);
}
