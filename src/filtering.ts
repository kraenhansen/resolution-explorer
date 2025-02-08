import { useMemo } from "react";
import { Resolution } from "./TraceParser.js";

function resolutionMatch(
  resolution: Record<string, unknown>,
  prop: keyof Resolution,
  pattern: RegExp
) {
  return (
    typeof resolution[prop] === "string" && resolution[prop].match(pattern)
  );
}

const KEYS_TO_FILTER = ["target", "from", "to"] as const;

export function useResolutionFilter(
  filter: string,
  highlighterCallback: (text: string) => string
) {
  return useMemo(() => {
    const patterns = filter
      .split(" ")
      .map((pattern) => new RegExp(pattern, "g"));
    const filterCallback = (resolution: Resolution) =>
      patterns.every((pattern) =>
        KEYS_TO_FILTER.some((key) => resolutionMatch(resolution, key, pattern))
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
