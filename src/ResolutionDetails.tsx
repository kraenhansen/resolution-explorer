import React from "react";

import { Box, Text, useInput } from "ink";

import type { Resolution } from "./TraceParser.js";
import { getResolutionLabel } from "./resolution-label.js";

type ResolutionDetailsProps = {
  resolution: Resolution;
  onClearSelection: () => void;
  height: number;
};

export function ResolutionDetails({
  onClearSelection,
  resolution,
  height,
}: ResolutionDetailsProps) {
  useInput((_input, key) => {
    if (key.escape || key.delete) {
      onClearSelection();
    }
  });

  return (
    <>
      <Box
        borderStyle="round"
        flexDirection="column"
        minHeight={height}
        width={"100%"}
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
    </>
  );
}
