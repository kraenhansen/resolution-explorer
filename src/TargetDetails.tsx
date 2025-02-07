import React, { useMemo, useRef, useState } from "react";

import { Box, DOMElement, Text } from "ink";
import TextInput from "ink-text-input";

import type { Resolution, TraceParser } from "./TraceParser.js";
import { TargetRow } from "./TargetRow.js";
import { useStdoutDimensions } from "./useStdoutDimensions.js";
import { Selector } from "./Selector.js";

function matchQuery(resolution: Resolution, query: string) {
  return resolution.target.includes(query);
}

type TargetDetailsProps = {
  resolutions: Resolution[];
  target: string | null;
  height: number;
};

export function TargetDetails({
  resolutions,
  target,
  height,
}: TargetDetailsProps) {
  const relevantResolutions = useMemo(() => {
    return resolutions.filter((resolution) => resolution.target === target);
  }, [resolutions, target]);

  return (
    <>
      <Box
        flexBasis="70%"
        paddingX={1}
        borderStyle="round"
        flexDirection="column"
        height={height}
      >
        <Box justifyContent={"center"} flexGrow={1} flexShrink={0}>
          {target ? (
            <>
              <Text>{target}</Text>
              <Text dimColor>
                {" "}
                ({relevantResolutions.length} / {resolutions.length}{" "}
                resolutions)
              </Text>
            </>
          ) : (
            <Text italic>Select a target</Text>
          )}
        </Box>
        {relevantResolutions.map((resolution, index) => (
          <Text key={index}>{resolution.from}</Text>
        ))}
      </Box>
    </>
  );
}
