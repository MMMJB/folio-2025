"use client";

import { useRef, useState, useEffect, useCallback } from "react";

import type { EventData } from "./timeline";

import { Timeline as T } from "./timeline";
import Project from "../Project";

// ( ͡° ͜ʖ ͡°)
const debugKey = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

interface HoverEventData {
  event: EventData;
  x: number;
  y: number;
}

export default function Timeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const w = useRef<number>(0);
  const h = useRef<number>(0);
  const mx = useRef<number>(0);
  const my = useRef<number>(0);
  const offsetX = useRef<number>(0);
  const offsetY = useRef<number>(0);
  const keyPosition = useRef<number>(0);
  const timeline = useRef<T | null>(null);

  const [hoveredEvent, setHoveredEvent] = useState<EventData | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);

  const onResize = useCallback(() => {
    if (!canvasRef.current) return;

    const { devicePixelRatio: dpr } = window;

    const { width, height, left, top } =
      canvasRef.current.getBoundingClientRect();
    w.current = canvasRef.current.width = width * dpr;
    h.current = canvasRef.current.height = height * dpr;
    offsetX.current = left * dpr;
    offsetY.current = top * dpr;

    timeline.current?.updateDimensions(w.current, h.current);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const { devicePixelRatio: dpr } = window;

    mx.current = e.clientX * dpr - offsetX.current;
    my.current = e.clientY * dpr - offsetY.current;
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!timeline.current) return;

    const key = e.key.toLowerCase();
    const expectedKey = debugKey[keyPosition.current];

    if (key === expectedKey) {
      keyPosition.current++;
    } else {
      keyPosition.current = 0;
    }

    if (keyPosition.current === debugKey.length) {
      timeline.current.toggleDebug();
      keyPosition.current = 0;
    }
  }, []);

  const onHover = useCallback((event: HoverEventData) => {
    if (event !== null) {
      setHoveredEvent(event.event);
      setHoverX(event.x);
      setHoverY(event.y);
    } else {
      setHoveredEvent(null);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) throw new Error("2D context not supported");
    const { devicePixelRatio: dpr } = window;
    ctx.scale(dpr, dpr);

    timeline.current = new T(ctx, w.current, h.current);

    onResize();

    let animationFrame = 0;
    const render = (timestamp?: number) => {
      ctx.clearRect(0, 0, w.current, h.current);

      timeline.current!.draw(timestamp, mx.current, my.current);

      animationFrame = requestAnimationFrame(render);
    };

    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    timeline.current.events.on("hover", onHover);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      timeline.current?.events.off("hover", onHover);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="absolute top-0 h-full w-1/3">
      <canvas ref={canvasRef} className="size-full" />
      <Project data={hoveredEvent} x={hoverX} y={hoverY} />
    </div>
  );
}
