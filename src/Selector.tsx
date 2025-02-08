import React, { useMemo } from "react";

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";

import type { Resolution } from "./TraceParser.js";
import { useFilteredResolutions } from "./filtering.js";
import chalk from "chalk";
import { getResolutionLabel } from "./resolution-label.js";

type SelectorProps = {
  resolutions: Resolution[];
  filter: string;
  resolution: Resolution | null;
  setResolution: (resolution: Resolution) => void;
  highlightedResolution: Resolution | null;
  setHighlightedResolution: (resolution: Resolution) => void;
  height: number;
  width: number;
  setFilter(filter: string): void;
};

type Item = {
  key?: string;
  label: string;
  value: Resolution;
};

export function Selector({
  resolutions,
  height,
  width,
  setResolution,
  highlightedResolution,
  setHighlightedResolution,
  filter,
  setFilter,
}: SelectorProps) {
  // Taking account for the input field
  const visibleItems = height - 2;

  const [filteredResolutions, highlighter] = useFilteredResolutions(
    resolutions,
    filter,
    (text) => chalk.bgBlue(text)
  );

  const items = useMemo(
    () =>
      filteredResolutions.map((resolution) => {
        return {
          key: resolution.index.toString() as string | undefined,
          label: getResolutionLabel(resolution, highlighter),
          value: resolution,
        } as Item;
      }),
    [filteredResolutions, highlighter]
  );

  const initialIndex = useMemo(
    () =>
      Math.max(
        0,
        items.findIndex(({ value }) => value === highlightedResolution)
      ),
    [items, highlightedResolution]
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
          limit={visibleItems}
          initialIndex={initialIndex}
          onSelect={({ value }) => {
            // In the case that the user select without moving the cursor
            setHighlightedResolution(value);
            setResolution(value);
          }}
          onHighlight={({ value }) => setHighlightedResolution(value)}
        />
      )}
    </Box>
  );
}
