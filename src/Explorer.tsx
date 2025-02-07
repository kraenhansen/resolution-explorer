import React, { useMemo, useRef, useState } from "react";

import { Box, DOMElement, Text } from "ink";
import TextInput from "ink-text-input";

import type { Resolution, TraceParser } from "./TraceParser.js";
import { useStdoutDimensions } from "./useStdoutDimensions.js";
import { Selector } from "./Selector.js";
import { TargetDetails } from "./TargetDetails.js";

function matchQuery(resolution: Resolution, query: string) {
  return resolution.target.includes(query);
}

type Filter = {
  targetPattern: RegExp | null;
  fromPattern: RegExp | null;
};

type ExplorerProps = { resolutions: Resolution[]; filter: Filter };

export function Explorer({ resolutions }: ExplorerProps) {
  const { rows } = useStdoutDimensions();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const uniqueTargets = useMemo(() => {
    return [...new Set(resolutions.map((resolution) => resolution.target))];
  }, [resolutions]);

  return (
    <>
      <Box overflow="hidden">
        <Selector
          height={rows}
          targets={uniqueTargets}
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
        />
        <TargetDetails
          height={rows}
          resolutions={resolutions}
          target={selectedTarget}
        />
      </Box>
    </>
  );
}
