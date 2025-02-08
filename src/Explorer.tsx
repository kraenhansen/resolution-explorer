import React, { useCallback, useMemo, useState } from "react";

import { Box } from "ink";

import type { Resolution } from "./TraceParser.js";
import { useStdoutDimensions } from "./useStdoutDimensions.js";
import { Selector } from "./Selector.js";
import { ResolutionDetails } from "./ResolutionDetails.js";

type ExplorerProps = {
  resolutions: Resolution[];
  initialFilter?: string;
};

export function Explorer({ resolutions, initialFilter }: ExplorerProps) {
  const { rows, columns } = useStdoutDimensions();
  const [filter, setFilter] = useState<string>(initialFilter ?? "");

  const [resolutionStack, setResolutionStack] = useState<Resolution[]>([]);
  const resolution = useMemo(
    () =>
      resolutionStack.length > 0
        ? resolutionStack[resolutionStack.length - 1]
        : null,
    [resolutionStack]
  );
  const pushResolution = useCallback(
    (resolution: Resolution) =>
      setResolutionStack([...resolutionStack, resolution]),
    [resolution, resolutionStack]
  );
  const popResolution = useCallback(
    () => setResolutionStack(resolutionStack.slice(0, -1)),
    [resolution, resolutionStack]
  );

  const [highlightedResolution, setHighlightedResolution] =
    useState<Resolution | null>(null);

  // Computing all outgoing resolutions for the selected resolution
  const outgoingResolutions = useMemo(
    () =>
      resolution
        ? resolutions.filter((other) => other.from === resolution.to)
        : [],
    [resolutions, resolution]
  );

  return (
    <>
      <Box overflow="hidden" flexDirection="column">
        {resolution ? (
          <ResolutionDetails
            key={resolution.index}
            height={rows}
            resolution={resolution}
            pushResolution={pushResolution}
            popResolution={popResolution}
            outgoingResolutions={outgoingResolutions}
          />
        ) : (
          <Selector
            height={rows}
            width={columns}
            resolutions={resolutions}
            resolution={resolution}
            setResolution={pushResolution}
            highlightedResolution={highlightedResolution}
            setHighlightedResolution={setHighlightedResolution}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </Box>
    </>
  );
}
