import React, { useState } from "react";

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
            setResolution={setResolution}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </Box>
    </>
  );
}
