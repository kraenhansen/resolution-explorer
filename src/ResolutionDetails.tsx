import React, { useState } from "react";

import { Box, Text, useInput } from "ink";

import type { Resolution } from "./TraceParser.js";
import { getResolutionLabel } from "./resolution-label.js";
import { Selector } from "./Selector.js";

const SELECTOR_MAX_HEIGHT = 10;

type ResolutionDetailsProps = {
  resolution: Resolution;
  pushResolution: (resolution: Resolution) => void;
  popResolution: () => void;
  outgoingResolutions: Resolution[];
  height: number;
};

export function ResolutionDetails({
  resolution,
  pushResolution,
  popResolution,
  outgoingResolutions,
  height,
}: ResolutionDetailsProps) {
  useInput((_input, key) => {
    if (key.escape) {
      popResolution();
    }
  });

  const [filter, setFilter] = useState<string>("");
  const selectorHeight = Math.min(
    SELECTOR_MAX_HEIGHT,
    outgoingResolutions.length + 2
  );

  return (
    <>
      <Box
        borderStyle="round"
        flexDirection="column"
        width="100%"
        minHeight={height}
        overflow="hidden"
        padding={1}
        paddingTop={0}
      >
        <Box
          justifyContent="center"
          flexShrink={0}
          borderStyle={"round"}
          borderTop={false}
          borderLeft={false}
          borderRight={false}
        >
          <Text>{getResolutionLabel(resolution)}</Text>
        </Box>
        <Box flexDirection="column" flexGrow={1}>
          {resolution ? (
            <>
              {resolution.details.map((line, index) => (
                <Text key={index}>{line}</Text>
              ))}
            </>
          ) : (
            <Text italic>Select a target</Text>
          )}
        </Box>
        <Box
          flexDirection="column"
          borderStyle={"single"}
          borderBottom={false}
          borderLeft={false}
          borderRight={false}
        >
          <Selector
            width="100%"
            height={selectorHeight}
            filter={filter}
            setFilter={setFilter}
            filterPlaceholder="Type to filter outgoing resolutions"
            resolutions={outgoingResolutions}
            setResolution={pushResolution}
          />
        </Box>
      </Box>
    </>
  );
}
