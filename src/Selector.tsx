import React, { useMemo } from "react";
import path from "node:path";

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";

import type { Resolution } from "./TraceParser.js";
import { useFilteredResolutions } from "./filtering.js";
import chalk from "chalk";

type SelectorProps = {
  resolutions: Resolution[];
  filter: string;
  setResolution: (resolution: Resolution) => void;
  height: number;
  width: number;
  setFilter(filter: string): void;
};

export function Selector({
  resolutions,
  height,
  width,
  setResolution,
  filter,
  setFilter,
}: SelectorProps) {
  // Taking account for the input field
  const visibleTargets = height - 2;

  const [filteredResolutions, highlighter] = useFilteredResolutions(
    resolutions,
    filter,
    (text) => chalk.bgBlue(text)
  );

  const items = useMemo(
    () =>
      filteredResolutions.map((resolution) => {
        const index = chalk.dim(`[${resolution.index}]`);
        return {
          key: resolution.index.toString(),
          label: `${index} ${highlighter(resolution.target)} ${chalk.dim("from")} ${highlighter(path.relative(process.cwd(), resolution.from))}`,
          value: resolution,
        };
      }),
    [filteredResolutions]
  );

  return (
    <Box height={height} flexDirection="column">
      <Box
        paddingLeft={1}
        borderStyle="round"
        borderTop={false}
        borderRight={false}
        borderLeft={false}
        borderColor={"gray"}
        width={width}
        flexShrink={0}
      >
        <Text>Filter resolutions: </Text>
        <TextInput
          placeholder="Type to filter resolutions"
          value={filter ?? ""}
          onChange={setFilter}
        />
      </Box>
      {items.length === 0 ? (
        <Text italic>No resolutions match the filter</Text>
      ) : (
        <SelectInput
          items={items}
          limit={visibleTargets}
          onSelect={({ value }) => setResolution(value)}
        />
      )}
    </Box>
  );
}
