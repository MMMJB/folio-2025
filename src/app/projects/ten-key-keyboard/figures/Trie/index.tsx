"use client";

import React, { useState, useEffect } from "react";

import Figure from "@/components/Figure";

import { Trie } from "./data";
import { fingermap, groupedFingermap } from "../Fingermap/data";

const words = fetch("/projects/ten-key-keyboard/words.txt")
  .then((res) => res.text())
  .then(
    (text) =>
      new Set(
        text
          .toLowerCase()
          .split(/\s+/g)
          .filter((word) =>
            word.split("").every((letter) => letter in fingermap),
          ),
      ),
  );

const trie = words.then((words) => Trie.buildTrie([...words]));

function Display({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid size-8 place-items-center rounded-sm border border-border bg-background text-sm outline-none transition-colors duration-100"
      tabIndex={-1}
    >
      {children}
    </span>
  );
}

export default function TrieFigure() {
  const [sequence, setSequence] = useState<number[]>([7, 3, 9, 9, 9]);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === "Backspace") {
      setSequence((p) => p.slice(0, -1));
      setPossibleWords([]);
      return;
    }

    const number = Number(e.key);
    if (isNaN(number)) return;

    setPossibleWords([]);
    setSequence((p) => [...p, number]);
  };

  const getWords = async () => {
    const t = await trie;
    const w = await words;

    let wordList: Set<string> | undefined = undefined;

    try {
      for (let i = 0; i < sequence.length; i++) {
        const finger = sequence[i];
        const isFirstLetter = i === 0;
        const isLastLetter = i === sequence.length - 1;
        const possibleLetters = groupedFingermap[finger];

        if (isFirstLetter) {
          wordList = new Set(possibleLetters);
          continue;
        } else if (!wordList) throw new Error("wordList is required");

        const possibleWords = new Set<string>();

        for (const word of wordList) {
          for (const possibleLetter of possibleLetters) {
            const newWord = word + possibleLetter;

            if (t.searchTrie(newWord)) {
              possibleWords.add(newWord);
            }
          }
        }

        if (!isLastLetter) {
          wordList = possibleWords;
        } else {
          const output = new Set(
            [...possibleWords].filter((word) => w.has(word)),
          );
          setPossibleWords([...output]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Figure>
      <div className="grid place-items-center p-6">
        <div className="flex flex-col items-center gap-2">
          <button
            disabled={!sequence.length}
            className="rounded border border-border bg-background px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            onClick={getWords}
          >
            Get words
          </button>
          <div className="flex min-h-10 min-w-10 gap-0.5 rounded-md border border-border bg-background p-1">
            {sequence.map((number, i) => (
              <Display key={i}>{number}</Display>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {possibleWords.map((word, i) => (
              <div className="flex gap-0.5" key={i}>
                {word.split("").map((letter, i) => (
                  <Display key={i}>{letter}</Display>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Figure>
  );
}
