"use client";

import { useRef, useEffect, useCallback } from "react";

import { Timeline as T } from "./timeline";

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

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 h-full w-1/3 lg:-left-32 xl:-left-20"
    />
  );
}
