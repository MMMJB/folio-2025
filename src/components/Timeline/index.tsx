"use client";

import { useRef, useEffect } from "react";

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
  const keyPosition = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) throw new Error("2D context not supported");
    const { devicePixelRatio: dpr } = window;
    ctx.scale(dpr, dpr);

    w.current = window.innerWidth;
    h.current = window.innerHeight;

    const timeline = new T(ctx, w.current, h.current);

    function onResize() {
      if (!canvasRef.current) return;

      const { width, height } = canvasRef.current.getBoundingClientRect();
      w.current = canvasRef.current.width = width * dpr;
      h.current = canvasRef.current.height = height * dpr;

      timeline.updateDimensions(w.current, h.current);
    }

    function onMouseMove(e: MouseEvent) {
      mx.current = e.clientX;
      my.current = e.clientY;
    }

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const expectedKey = debugKey[keyPosition.current];

      if (key === expectedKey) {
        keyPosition.current++;
      } else {
        keyPosition.current = 0;
      }

      if (keyPosition.current === debugKey.length) {
        timeline.toggleDebug();
        keyPosition.current = 0;
      }
    }

    onResize();

    let animationFrame = 0;
    const render = (timestamp?: number) => {
      ctx.clearRect(0, 0, w.current, h.current);

      timeline.draw(timestamp, mx.current, my.current);

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
    <canvas ref={canvasRef} className="absolute -left-40 top-0 h-full w-1/3" />
  );
}
