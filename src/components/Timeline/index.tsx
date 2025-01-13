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
  const dpr = useRef<number>(1);
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

    const { width, height, left, top } =
      canvasRef.current.getBoundingClientRect();
    w.current = canvasRef.current.width = width * dpr.current;
    h.current = canvasRef.current.height = height * dpr.current;
    offsetX.current = left * dpr.current;
    offsetY.current = top * dpr.current;

    timeline.current?.updateDimensions(w.current, h.current);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mx.current = e.clientX * dpr.current - offsetX.current;
    my.current = e.clientY * dpr.current - offsetY.current;
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
      setHoverX(event.x / dpr.current);
      setHoverY(event.y / dpr.current);
    } else {
      setHoveredEvent(null);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) throw new Error("2D context not supported");

    dpr.current = 1;
    ctx.scale(dpr.current, dpr.current);

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
    <div className="absolute top-0 hidden h-full w-1/3 -translate-x-12 lg:block">
      <canvas ref={canvasRef} className="size-full" />
      <Project data={hoveredEvent} x={hoverX} y={hoverY} />
    </div>
  );
}
