import React, { useMemo, useRef, useState } from "react";

import { Box, DOMElement, Text } from "ink";
import TextInput from "ink-text-input";

import type { Resolution } from "./TraceParser.js";
import type { ResolutionFilter } from "./filtering.js";
import { useStdoutDimensions } from "./useStdoutDimensions.js";
import { Selector } from "./Selector.js";
import { ResolutionDetails } from "./ResolutionDetails.js";

type ExplorerProps = {
  resolutions: Resolution[];
  initialFilter?: ResolutionFilter;
};

export function Explorer({ resolutions, initialFilter }: ExplorerProps) {
  const { rows } = useStdoutDimensions();
  const [filter, setFilter] = useState<ResolutionFilter>(
    initialFilter ?? {
      target: null,
      from: null,
    }
  );
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
            resolutions={resolutions}
            setResolution={setResolution}
            filter={filter}
          />
        )}
      </Box>
    </>
  );
}
