import * as readline from "node:readline";
import { Readable } from "node:stream";
import * as fs from "node:fs";
import assert from "node:assert/strict";

export type Resolution = {
  index: number;
  type: "reference" | "module";
  state: "resolving" | "resolved" | "failed";
  target: string;
  from: string;
  details: string[];
  result: string | undefined;
  packageId: string | undefined;
  rootDirectory: string | undefined;
  primary: boolean | undefined;
};

export class TraceParser {
  public readonly resolutions: Resolution[] = [];

  #used = false;
  #currentResolution: Resolution | null = null;

  get used() {
    return this.#used;
  }

  async parseFile(filePath: string): Promise<void> {
    const input = fs.createReadStream(filePath);
    return this.parse(input);
  }

  async parse(input: Readable): Promise<void> {
    if (this.#used) {
      throw new Error("TraceParser is not reusable");
    } else {
      this.#used = true;
    }

    const rl = readline.createInterface({
      input,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.startsWith("========")) {
        // New heading
        const resolvingModuleMatch = line.match(
          /======== Resolving module '(?<target>[^']+)' from '(?<from>[^']+)'. ========/
        );
        const successMatch = line.match(
          /======== Module name '(?<target>[^']+)' was successfully resolved to '(?<result>[^']+)'(?: with Package ID '(?<packageId>[^']+)')?. ========/
        );
        const failedMatch = line.match(
          /======== Module name '(?<target>[^']+)' was not resolved. ========/
        );
        const resolvingReferenceMatch = line.match(
          /======== Resolving type reference directive '(?<target>[^']+)', containing file '(?<from>[^']+)'(?:, root directory '(?<rootDirectory>[^']+)')?. ========/
        );
        const successReferenceMatch = line.match(
          /======== Type reference directive '(?<target>[^']+)' was successfully resolved to '(?<result>[^']+)'(?: with Package ID '(?<packageId>[^']+)')?(?:, primary: (?<primary>\w+))?. ========/
        );

        if (resolvingModuleMatch) {
          assert(
            resolvingModuleMatch.groups,
            "Expected a match to have groups"
          );
          const { target, from } = resolvingModuleMatch.groups;
          this.startResolution({
            type: "module",
            state: "resolving",
            target,
            from,
            details: [],
            result: undefined,
            packageId: undefined,
            rootDirectory: undefined,
            primary: undefined,
          });
        } else if (successMatch) {
          assert(successMatch.groups, "Expected a match to have groups");
          const { target, result, packageId } = successMatch.groups;
          assert(this.#currentResolution, "Expected a current resolution");
          this.endResolution({
            target,
            result,
            packageId,
            state: "resolved",
          });
        } else if (failedMatch) {
          assert(failedMatch.groups, "Expected a match to have groups");
          const { target } = failedMatch.groups;
          this.endResolution({
            target,
            state: "failed",
          });
        } else if (resolvingReferenceMatch) {
          assert(
            resolvingReferenceMatch.groups,
            "Expected a match to have groups"
          );
          const { target, from, rootDirectory } =
            resolvingReferenceMatch.groups;
          this.startResolution({
            type: "reference",
            state: "resolving",
            target,
            from,
            details: [],
            result: undefined,
            packageId: undefined,
            rootDirectory,
            primary: undefined,
          });
        } else if (successReferenceMatch) {
          assert(
            successReferenceMatch.groups,
            "Expected a match to have groups"
          );
          const { target, result, packageId, primary } =
            successReferenceMatch.groups;
          this.endResolution({
            target,
            state: "resolved",
            result,
            packageId,
            primary:
              primary === "true"
                ? true
                : primary === "false"
                  ? false
                  : undefined,
          });
        } else {
          console.log(`Unknown heading: ${line}`);
          throw new Error("Unknown heading");
        }
      } else if (this.#currentResolution) {
        this.#currentResolution.details.push(line);
      }
    }
  }

  private startResolution(resolution: Omit<Resolution, "index">) {
    assert.equal(
      this.#currentResolution,
      null,
      "Expected no current resolution"
    );
    this.#currentResolution = { ...resolution, index: this.resolutions.length };
    this.resolutions.push(this.#currentResolution);
  }

  private updateResolution(
    values: Partial<Resolution> & Pick<Resolution, "target">
  ) {
    assert(this.#currentResolution, "Expected a current resolution");
    assert.equal(this.#currentResolution.target, values.target);
    Object.assign(this.#currentResolution, values);
  }

  private endResolution(
    values: Partial<Resolution> &
      Pick<Resolution, "target"> & {
        state: Exclude<Resolution["state"], "resolving">;
      }
  ) {
    this.updateResolution(values);
    this.#currentResolution = null;
  }
}
