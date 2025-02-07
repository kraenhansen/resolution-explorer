import React, { useCallback, useState } from "react";

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
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [highlightedResolution, setHighlightedResolution] =
    useState<Resolution | null>(null);

  return (
    <>
      <Box overflow="hidden">
        {resolution ? (
          <ResolutionDetails
            height={rows}
            resolution={resolution}
            onClearSelection={() => setResolution(null)}
          />
        ) : (
          <Selector
            height={rows}
            width={columns}
            resolutions={resolutions}
            resolution={resolution}
            setResolution={setResolution}
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
