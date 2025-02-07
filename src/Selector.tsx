import React, { useMemo, useRef, useState } from "react";

import { Box, DOMElement, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";

import type { Resolution } from "./TraceParser.js";

function matchQuery(resolution: Resolution, query: string) {
  return resolution.target.includes(query);
}

type SelectorProps = {
  targets: string[];
  selectedTarget: string | null;
  setSelectedTarget: (target: string | null) => void;
  height: number;
};

export function Selector({
  targets,
  selectedTarget,
  setSelectedTarget,
  height,
}: SelectorProps) {
  const [query, setQuery] = useState("");
  const ref = useRef<DOMElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(targets.length - 1, prev + 1));
    } else if (key.escape || key.backspace) {
      setSelectedTarget(null);
    }
  });

  // Taking account for the input field
  const visibleTargets = height - 2;

  const filteredTargets = useMemo(
    () =>
      targets
        .filter((target) =>
          target.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )
        .map((target) => ({ key: target, label: target, value: target })),
    [targets, query, visibleTargets]
  );

  return (
    <Box height={height} flexDirection="column" flexBasis="30%">
      <TextInput value={query} onChange={setQuery} />
      <SelectInput
        items={filteredTargets}
        limit={visibleTargets}
        isFocused={selectedTarget === null}
        onSelect={({ value }) => setSelectedTarget(value)}
      />
    </Box>
  );
}
