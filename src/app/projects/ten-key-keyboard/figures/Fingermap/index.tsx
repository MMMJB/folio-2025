"use client";

import { useRef, useState, useEffect } from "react";

import Figure from "@/components/Figure";

import { fingermap, keyboardLayout } from "./data";

import type { Key } from "./data";

const getColorForSection = (section: number) => `hsl(${25 * section} 80% 50%)`;

function Key({
  letter,
  highlight,
  onPress,
}: {
  letter: string;
  highlight?: string;
  onPress?: () => void;
}) {
  const keyRef = useRef<HTMLButtonElement>(null);

  const [pressed, setPressed] = useState(false);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key !== letter || e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    setPressed(true);
  };

  const mouseDownHandler = () => {
    onPress?.();
    setPressed(true);
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key !== letter) return;

    setPressed(false);
  };

  const mouseUpHandler = () => {
    setPressed(false);
  };

  useEffect(() => {
    if (!keyRef.current) return;

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    keyRef.current.addEventListener("mousedown", mouseDownHandler);
    keyRef.current.addEventListener("mouseup", mouseUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);

      keyRef.current?.removeEventListener("mousedown", mouseDownHandler);
      keyRef.current?.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [keyDownHandler, keyUpHandler, mouseDownHandler, mouseUpHandler]);

  return (
    <button
      ref={keyRef}
      className={`${pressed ? "bg-surface/50" : "bg-background"} ${
        letter === " " ? "w-80" : "w-10"
      } key relative h-8 rounded-sm border border-border text-sm outline-none transition-colors duration-100`}
      tabIndex={-1}
      style={{
        "--highlight": highlight ?? "transparent",
      }}
    >
      {letter !== " " ? letter : <span>&#x2423;</span>}
    </button>
  );
}

function Keyboard({
  coloredFingers,
  coloredSection,
}: {
  coloredFingers?: boolean;
  coloredSection?: number;
}) {
  return (
    <div className="flex w-max flex-col items-center gap-1 rounded-md border border-border bg-background p-1">
      {keyboardLayout.map((row, i) => (
        <div className="flex w-full gap-0.5" key={i}>
          {i !== 0 && (
            <div className="h-8 flex-grow rounded-sm border border-border" />
          )}
          {row.map((key) => {
            const highlightColor = getColorForSection(fingermap[key]);
            const isColoredFinger = coloredFingers && !!fingermap[key];
            const isColoredSection = coloredSection === fingermap[key];

            return (
              <Key
                key={key}
                letter={key}
                highlight={
                  isColoredFinger || isColoredSection ? highlightColor : ""
                }
              />
            );
          })}
          {i !== 0 && (
            <div className="h-8 flex-grow rounded-sm border border-border" />
          )}
        </div>
      ))}
    </div>
  );
}

export function FingermapFigure({
  coloredFingers,
}: {
  coloredFingers?: boolean;
}) {
  return (
    <Figure>
      <div className="grid place-items-center p-6">
        <Keyboard coloredFingers={coloredFingers} />
      </div>
    </Figure>
  );
}

export function ZonedFingermapFigure({ sequence }: { sequence: number[] }) {
  const [coloredIndex, setColoredIndex] = useState(0);

  const coloredSection = sequence[coloredIndex];

  return (
    <Figure>
      <div className="grid place-items-center p-6">
        {sequence.length && (
          <div className="mb-3 flex rounded-md border border-border bg-background p-1">
            {sequence.map((letter, i) => (
              <Key
                key={i}
                letter={letter.toString()}
                highlight={
                  coloredIndex === i
                    ? getColorForSection(coloredSection)
                    : undefined
                }
                onPress={() => setColoredIndex(i)}
              />
            ))}
          </div>
        )}
        <Keyboard coloredSection={coloredSection} />
      </div>
    </Figure>
  );
}
