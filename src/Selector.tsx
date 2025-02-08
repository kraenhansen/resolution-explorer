import React, { useMemo } from "react";

import { Box, BoxProps, Text } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";

import type { Resolution } from "./TraceParser.js";
import { useFilteredResolutions } from "./filtering.js";
import chalk from "chalk";
import { getResolutionLabel } from "./resolution-label.js";

type SelectorProps = {
  resolutions: Resolution[];
  filter: string;
  resolution?: Resolution | null;
  setResolution: (resolution: Resolution) => void;
  highlightedResolution?: Resolution | null;
  setHighlightedResolution?: (resolution: Resolution) => void;
  height: number;
  width: BoxProps["width"];
  setFilter(filter: string): void;
  filterPlaceholder?: string;
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
  highlightedResolution = null,
  setHighlightedResolution = () => {},
  filter,
  setFilter,
  filterPlaceholder = "Type to filter resolutions",
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
    <Box flexBasis={height} flexDirection="column" flexGrow={0}>
      {resolutions.length === 0 ? (
        <Text italic>No resolutions to show</Text>
      ) : (
        <>
          <Box
            borderStyle="single"
            paddingLeft={1}
            borderTop={false}
            borderRight={false}
            borderLeft={false}
            borderColor={"gray"}
            width={width}
            flexBasis={1}
            flexShrink={0}
          >
            <TextInput
              placeholder={filterPlaceholder}
              value={filter ?? ""}
              onChange={setFilter}
            />
          </Box>
          {filteredResolutions.length === 0 ? (
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
        </>
      )}
    </Box>
  );
}
