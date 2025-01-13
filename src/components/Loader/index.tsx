"use client";

import { useRef, useState, useEffect } from "react";

import { TRACK_COLOR, TRACK_FILL_COLOR, PROGRESS } from "../Timeline/timeline";

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !progressRef.current) return;

    progressRef.current.style.height = `${PROGRESS * 100}%`;
    setLoading(false);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? "auto" : "none",
      }}
      className="fixed inset-0 z-50 -translate-x-12 bg-background transition-opacity duration-500"
    >
      <div className="flex h-full w-1/3 justify-center">
        <div
          className="relative h-full w-0.5"
          style={{
            backgroundColor: TRACK_COLOR,
          }}
        >
          <div
            ref={progressRef}
            style={{
              backgroundColor: TRACK_FILL_COLOR,
              transition: "height 500ms ease",
            }}
            className="absolute bottom-0 h-0 w-full"
          >
            <div
              style={{
                backgroundColor: TRACK_FILL_COLOR,
                border: `7px solid ${TRACK_COLOR}`,
              }}
              className="absolute left-1/2 top-0 box-content size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
