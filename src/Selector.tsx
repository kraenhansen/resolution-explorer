import React, { useMemo, useRef, useState } from "react";

import { Box, DOMElement, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";

import type { Resolution } from "./TraceParser.js";
import {
  ResolutionFilter,
  useFilteredResolutions,
  useResolutionFilter,
} from "./filtering.js";
import chalk from "chalk";

function matchQuery(resolution: Resolution, query: string) {
  return resolution.target.includes(query);
}

type SelectorProps = {
  resolutions: Resolution[];
  filter: ResolutionFilter;
  height: number;
  setResolution: (resolution: Resolution) => void;
};

export function Selector({
  resolutions,
  height,
  filter,
  setResolution,
}: SelectorProps) {
  // Taking account for the input field
  const visibleTargets = height - 1;

  const filteredResolutions = useFilteredResolutions(resolutions, filter);
  const items = useMemo(
    () =>
      filteredResolutions.map((resolution) => {
        const index = chalk.dim(`[${resolution.index}]`);
        return {
          key: resolution.index.toString(),
          label: `${index} ${resolution.target} ${chalk.dim("from")} ${resolution.from}`,
          value: resolution,
        };
      }),
    [filteredResolutions]
  );

  return (
    <Box height={height} flexDirection="column">
      <Text bold>Pick a resolution</Text>
      <SelectInput
        items={items}
        limit={visibleTargets}
        onSelect={({ value }) => setResolution(value)}
      />
    </Box>
  );
}
