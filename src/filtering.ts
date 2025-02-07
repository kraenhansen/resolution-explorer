import { useMemo } from "react";
import { Resolution } from "./TraceParser.js";
import chalk from "chalk";

function resolutionMatch(
  resolution: Record<string, unknown>,
  prop: keyof Resolution,
  pattern: RegExp
) {
  return (
    typeof resolution[prop] === "string" && resolution[prop].match(pattern)
  );
}

export function useResolutionFilter(
  filter: string,
  highlighterCallback: (text: string) => string
) {
  return useMemo(() => {
    const patterns = filter
      .split(" ")
      .map((pattern) => new RegExp(pattern, "g"));
    const filterCallback = (resolution: Resolution) =>
      patterns.every(
        (pattern) =>
          resolutionMatch(resolution, "target", pattern) ||
          resolutionMatch(resolution, "from", pattern)
      );
    const highlighter = (text: string) =>
      patterns.reduce((acc, pattern) => {
        return acc.replaceAll(pattern, highlighterCallback);
      }, text);
    return { filterCallback, highlighter };
  }, [filter]);
}

export function useFilteredResolutions(
  resolutions: Resolution[],
  filter: string,
  highlighterCallback: (text: string) => string
) {
  const { filterCallback, highlighter } = useResolutionFilter(
    filter,
    highlighterCallback
  );
  return useMemo(
    () => [resolutions.filter(filterCallback), highlighter] as const,
    [resolutions, filter]
  );
}
