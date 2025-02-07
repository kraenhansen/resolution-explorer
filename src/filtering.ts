import { useMemo } from "react";
import { Resolution } from "./TraceParser.js";

function matchQuery(resolution: Resolution, query: string) {
  return resolution.target.includes(query);
}

export type ResolutionFilter = {
  target: RegExp | null;
  from: RegExp | null;
};

function resolutionMatch(
  resolution: Record<string, unknown>,
  prop: string,
  pattern: RegExp
) {
  if (pattern === null) return true;
  return (
    prop in resolution &&
    typeof resolution[prop] === "string" &&
    resolution[prop].match(pattern)
  );
}

export function useResolutionFilter(filter: ResolutionFilter) {
  return useMemo(() => {
    return (resolution: Resolution) =>
      Object.entries(filter).every(
        ([key, pattern]) =>
          pattern === null || resolutionMatch(resolution, key, pattern)
      );
  }, Object.values(filter));
}

export function useFilteredResolutions(
  resolutions: Resolution[],
  filter: ResolutionFilter
) {
  const filterCallback = useResolutionFilter(filter);
  return useMemo(
    () => resolutions.filter(filterCallback),
    [resolutions, filter]
  );
}
