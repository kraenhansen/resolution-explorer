import React from "react";

import * as cp from "node:child_process";
import * as path from "node:path";
import { once } from "node:events";

import { render } from "ink";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";

import { Explorer } from "./Explorer.js";
import { TraceParser } from "./TraceParser.js";

export function run(args = hideBin(process.argv)) {
  yargs(args)
    .scriptName("resolution-explorer")
    .command(
      "$0",
      "Explore resolution of TypeScript project",
      (yargs) =>
        yargs
          .option("trace", {
            description:
              "The path of a trace file generated with --traceResolution",
            normalize: true,
            coerce: (value) => path.resolve(value),
          })
          .option("project", {
            description: "The path of a typescript project's tsconfig.json",
            normalize: true,
            coerce: (value) => path.resolve(value),
            default: path.resolve(process.cwd(), "tsconfig.json"),
          }),
      async (args) => {
        const parser = new TraceParser();
        if (args.trace) {
          await parser.parseFile(args.trace);
        } else if (args.project) {
          console.log("Running TypeScript compiler to trace resolution ...");

          const compilerProcess = cp.spawn(
            "tsc",
            ["--noEmit", "--traceResolution", "--project", args.project],
            {
              stdio: ["ignore", "pipe", "inherit"],
            }
          );
          // Propagate signals to the compiler process
          process.once("SIGINT", () => compilerProcess.kill("SIGINT"));
          process.once("exit", () => compilerProcess.kill());

          const compilerProcessExit = once(compilerProcess, "exit");
          await parser.parse(compilerProcess.stdout);
          // Propagate a failure of the compilation
          const [exitCode] = await compilerProcessExit;
          if (typeof exitCode === "number" && exitCode !== 0) {
            process.exitCode = exitCode;
            // Re-run the compiler to show the error messages
            // Ideally we would just pipe the output of the compiler to the parent process
            // but that's already consumed by the parser.
            cp.spawnSync("tsc", ["--noEmit", "--project", args.project], {
              stdio: "inherit",
            });
            return;
          }
        } else {
          console.error("Either --trace or --project must be provided");
          process.exitCode = 1;
          return;
        }
        render(<Explorer resolutions={parser.resolutions} />);
      }
    )
    .parseAsync()
    .catch(console.error);
}
