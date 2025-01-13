import type { Timestep } from "@/utils/timestep";

import lerp from "@/utils/lerp";
import clamp from "@/utils/clamp";
import events from "@/_data.json";
import EventEmitter from "events";
import { getMaximumTimestepForDuration } from "@/utils/timestep";

const PX_PER_SECOND = 5; // 1s = 5px
const PROGRESS = 0.8;
const UNFILLED_TRACK_COLOR = "#EBE6DE50";
const TRACK_COLOR = "#EBE6DE";
const TRACK_FILL_COLOR = "#423F3C";
const COMPLETE_EVENT_COLOR = "#BE6A52";
const UNDERWAY_EVENT_COLOR = COMPLETE_EVENT_COLOR;
const ABANDONED_EVENT_COLOR = TRACK_COLOR;

const startDate = new Date("2007-05-25T14:23:42Z").getTime();
const now = Date.now();
const endDate = startDate + 1000 * 60 * 60 * 24 * 365 * 80; // 80 years later

export interface EventData {
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  tags: string[];
  status: "underway" | "abandoned" | "complete";
  layer: number;
  thumbnail?: string;
  github?: string;
  website?: string;
  work?: string;
}

const eventData = events.map((event) => ({
  ...event,
  endDate: (event.endDate === "Present" ? now : event.endDate) as number,
})) as EventData[];

export class Timeline {
  private debug: boolean = false;
  private scale: number = 9e-4;
  private targetScale: number = 3e-6;
  private c: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private t: number = 0;
  private lastFrameTime: number = 0;
  private windowStart: number = 0;
  private intervalValue: number = 1000 * 60;
  private intervalScale: Timestep = "s";
  private hoveredEvent: string | null = null;

  public events: EventEmitter = new EventEmitter();

  // TODO: cache points?

  constructor(
    ctx: CanvasRenderingContext2D,
    ctxWidth: number,
    ctxHeight: number,
  ) {
    this.c = ctx;
    this.w = ctxWidth;
    this.h = ctxHeight;

    window.addEventListener("wheel", this.onScroll.bind(this));
  }

  private computeWindow() {
    const windowDuration = Math.max(this.h / (PX_PER_SECOND * this.scale)); // Span of window in seconds
    const start = now - windowDuration * PROGRESS * 1000; // progress% of the window duration

    const [interval, scale] = getMaximumTimestepForDuration(
      windowDuration * 1000,
      10,
    );

    this.windowStart = start;
    this.intervalScale = scale;
    this.intervalValue = interval;
  }

  private getYForTimestamp(timestamp: number): number {
    const relativeTime = timestamp - this.windowStart;
    return this.h - (relativeTime / 1000) * PX_PER_SECOND * this.scale;
  }

  private onScroll(e: WheelEvent) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.targetScale *= delta;
    this.targetScale = clamp(this.targetScale, 1e-8, 150);
    this.computeWindow();
  }

  private drawTrack(startPos: number, endPos: number) {
    this.c.lineWidth = 2;

    if (startPos < this.h || endPos > 0) {
      this.c.strokeStyle = UNFILLED_TRACK_COLOR;
      this.c.beginPath();
      this.c.moveTo(this.w / 2, this.h);
      this.c.lineTo(this.w / 2, 0);
      this.c.stroke();
    }

    this.c.strokeStyle = TRACK_COLOR;
    this.c.beginPath();
    this.c.moveTo(this.w / 2, Math.min(this.h, startPos));
    this.c.lineTo(this.w / 2, Math.max(0, endPos));
    this.c.stroke();
  }

  private drawProgress(startPos: number, endPos: number) {
    this.c.lineWidth = 2;

    // Draw progress line
    this.c.strokeStyle = TRACK_FILL_COLOR;
    this.c.beginPath();
    this.c.moveTo(this.w / 2, startPos);
    this.c.lineTo(this.w / 2, this.h * (1 - PROGRESS));
    this.c.stroke();

    // Draw progress tail
    this.c.beginPath();
    this.c.moveTo(this.w / 2 - 4, startPos);
    this.c.lineTo(this.w / 2 + 4, startPos);
    this.c.stroke();

    // Draw endpoint
    this.c.strokeStyle = TRACK_COLOR;
    this.c.beginPath();
    this.c.moveTo(this.w / 2 - 4, endPos);
    this.c.lineTo(this.w / 2 + 4, endPos);
    this.c.stroke();

    // Draw progress head
    this.c.lineWidth = 7;
    this.c.fillStyle = TRACK_FILL_COLOR;
    this.c.beginPath();
    this.c.arc(this.w / 2, this.h * (1 - PROGRESS), 6, 0, Math.PI * 2);
    this.c.fill();
    this.c.stroke();
  }

  private drawTick(
    y: number,
    startY: number,
    endY: number,
    size: number = 12,
    label?: string,
  ) {
    if (y > (1 - PROGRESS) * this.h && y < startY) {
      this.c.strokeStyle = TRACK_FILL_COLOR;
    } else if (y > endY) {
      this.c.strokeStyle = TRACK_COLOR;
    } else {
      this.c.strokeStyle = UNFILLED_TRACK_COLOR;
    }

    this.c.beginPath();
    this.c.moveTo(this.w / 2 - size, y);
    this.c.lineTo(this.w / 2 + size, y);
    this.c.closePath();
    this.c.stroke();

    if (label && y > (1 - PROGRESS) * this.h) {
      const distanceToStart = y - this.h * (1 - PROGRESS);

      this.c.save();
      this.c.globalAlpha = distanceToStart / this.w;
      this.c.fillStyle = TRACK_FILL_COLOR;
      this.c.font = "14px Instrument Serif";
      this.c.fillText(label, this.w / 2 - size - 16, y + 2);
      this.c.restore();
    }
  }

  private drawTicks(startY: number, endY: number) {
    this.c.lineWidth = 1;
    this.c.textAlign = "right";

    const timestep = (this.intervalValue / 1000) * PX_PER_SECOND * this.scale;
    const offset =
      ((this.t % this.intervalValue) / 1000) * PX_PER_SECOND * this.scale;
    const start = this.h * (1 - PROGRESS) + offset;

    // Draw ticks below current time
    let y = start;
    let i = 0;

    while (y < this.h) {
      i++;

      this.drawTick(y, startY, endY, 12, `${i}${this.intervalScale} ago`);
      y += timestep / 2;
      this.drawTick(y, startY, endY, 6);
      y += timestep / 2;
    }

    // Draw ticks above current time
    y = start;

    while (y > 0) {
      this.drawTick(y, startY, endY);
      y -= timestep / 2;
      this.drawTick(y, startY, endY, 6);
      y -= timestep / 2;
    }
  }

  private drawEvents(mx?: number, my?: number) {
    // this.c.lineCap = "round";
    this.c.lineWidth = 2;

    for (let i = 0; i < eventData.length; i++) {
      const event = eventData[i];

      const startPos = this.getYForTimestamp(event.startDate);
      const endPos = this.getYForTimestamp(event.endDate);

      if (startPos < 0 && endPos < 0) continue;

      if (event.status === "underway") {
        this.c.strokeStyle = UNDERWAY_EVENT_COLOR;
        this.c.fillStyle = UNDERWAY_EVENT_COLOR;
      } else if (event.status === "complete") {
        this.c.strokeStyle = COMPLETE_EVENT_COLOR;
        this.c.fillStyle = COMPLETE_EVENT_COLOR;
      } else {
        this.c.strokeStyle = ABANDONED_EVENT_COLOR;
        this.c.fillStyle = ABANDONED_EVENT_COLOR;
      }

      const x = this.w / 2 + (event.layer + 1) * 10 + 12;

      if (
        my &&
        mx &&
        my < startPos &&
        my > endPos &&
        mx > x - 5 &&
        mx < x + 5
      ) {
        if (this.hoveredEvent !== event.title) {
          this.hoveredEvent = event.title;

          if (event.website || event.github) {
            this.c.canvas.style.cursor = "pointer";
            this.c.canvas.onclick = () => {
              window.open(event.website ?? event.github, "_blank");
            };
          }
        }

        this.events.emit("hover", {
          event,
          x: x + 5,
          y: my,
        });
      } else if (this.hoveredEvent === event.title) {
        this.c.canvas.style.cursor = "default";
        this.c.canvas.onclick = null;
        this.hoveredEvent = null;

        this.events.emit("hover", null);
      }

      this.c.beginPath();
      this.c.moveTo(x, startPos);
      this.c.lineTo(x, endPos);
      this.c.stroke();
    }
  }

  private drawDebug(delta: number, mx?: number, my?: number) {
    const windowWidth = Math.max(this.w / (PX_PER_SECOND * this.scale));

    const stats = [
      `Scale: ${this.scale.toFixed(8)}x`,
      `Window span: ${windowWidth.toFixed(2)}s`,
      `Tick interval: ${this.intervalValue}ms (${this.intervalScale})`,
      `(${mx}, ${my}) intersecting ${this.hoveredEvent}`,
      `Render time: ${delta.toFixed(2)}ms`,
      `t: ${this.t.toFixed(2)}ms`,
    ];

    this.c.font = "12px monospace";
    this.c.textAlign = "right";
    this.c.fillStyle = "#000";
    stats.forEach((stat, i) => {
      this.c.fillText(stat, this.w - 10, 20 + i * 20);
    });
  }

  public draw(timestamp?: number, mx?: number, my?: number) {
    const now = timestamp || 0;
    let dt = 0;

    if (this.lastFrameTime) {
      this.t = this.t + (now - this.lastFrameTime);
      dt = now - this.lastFrameTime;
    }

    this.lastFrameTime = now;

    if (this.scale !== this.targetScale) {
      const SCALE_FACTOR = 0.008;
      const alpha = clamp(dt * SCALE_FACTOR, 0, 1);
      this.scale = lerp(this.scale, this.targetScale, alpha);
      this.computeWindow();
    }

    const startPos = this.getYForTimestamp(startDate);
    const endPos = this.getYForTimestamp(endDate);

    this.drawTicks(startPos, endPos);
    this.drawTrack(startPos, endPos);
    this.drawEvents(mx, my);
    // this.drawCursor(startPos, endPos, mx, my);
    this.drawProgress(startPos, endPos);

    if (this.debug) this.drawDebug(dt, mx, my);
  }

  public updateDimensions(newWidth: number, newHeight: number) {
    this.w = newWidth;
    this.h = newHeight;
    this.computeWindow();
  }

  public toggleDebug() {
    this.debug = !this.debug;
  }
}
