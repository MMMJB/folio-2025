import type { Timestep } from "@/utils/timestep";

import lerp from "@/utils/lerp";
import clamp from "@/utils/clamp";
import events from "@/_data.json";
import { getMaximumTimestepForDuration } from "@/utils/timestep";

const PX_PER_SECOND = 5; // 1s = 5px
const UNFILLED_TRACK_COLOR = "#EBE6DE50";
const TRACK_COLOR = "#EBE6DE";
const TRACK_FILL_COLOR = "#423F3C";
const COMPLETE_EVENT_COLOR = "#BE6A52";
const UNDERWAY_EVENT_COLOR = COMPLETE_EVENT_COLOR;
const ABANDONED_EVENT_COLOR = TRACK_COLOR;

const startDate = new Date("2007-05-25T14:23:42Z").getTime();
const now = Date.now();
const endDate = startDate + 1000 * 60 * 60 * 24 * 365 * 80; // 80 years later

interface EventData {
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  tags: string[];
  status: "underway" | "abandoned" | "complete";
  layer: number;
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

  private scale: number = 4e-6;
  private targetScale: number = this.scale;
  private c: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private t: number = 0;
  private lastFrameTime: number = 0;
  private windowStart: number = 0;
  private intervalValue: number = 1000 * 60 * 60 * 24 * 365; // 1 year
  private intervalScale: Timestep = "y";

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
    const windowDuration = Math.max(this.w / (PX_PER_SECOND * this.scale)); // Span of window in seconds
    const start = now - windowDuration * 0.75 * 1000; // 75% of the window duration

    const [interval, scale] = getMaximumTimestepForDuration(
      windowDuration * 1000,
      20,
    );

    this.windowStart = start;
    this.intervalScale = scale;
    this.intervalValue = interval;
  }

  private getXForTimestamp(timestamp: number): number {
    const relativeTime = timestamp - this.windowStart;
    return (relativeTime / 1000) * PX_PER_SECOND * this.scale;
  }

  private onScroll(e: WheelEvent) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.targetScale *= delta;
    this.targetScale = clamp(this.targetScale, 1e-8, 150);
    this.computeWindow();
  }

  private drawTrack(startPos: number, endPos: number) {
    this.c.lineWidth = 2;

    if (startPos > 0 || endPos < this.w) {
      this.c.strokeStyle = UNFILLED_TRACK_COLOR;
      this.c.beginPath();
      this.c.moveTo(0, this.h / 2);
      this.c.lineTo(this.w, this.h / 2);
      this.c.stroke();
    }

    this.c.strokeStyle = TRACK_COLOR;
    this.c.beginPath();
    this.c.moveTo(Math.max(0, startPos), this.h / 2);
    this.c.lineTo(Math.min(this.w, endPos), this.h / 2);
    this.c.stroke();
  }

  private drawProgress(startPos: number, endPos: number) {
    // Draw progress line
    this.c.strokeStyle = TRACK_FILL_COLOR;
    this.c.beginPath();
    this.c.moveTo(startPos, this.h / 2);
    this.c.lineTo(this.w * 0.75, this.h / 2);
    this.c.stroke();

    // Draw progress tail
    this.c.beginPath();
    this.c.moveTo(startPos, this.h / 2 - 4);
    this.c.lineTo(startPos, this.h / 2 + 4);
    this.c.stroke();

    // Draw endpoint
    this.c.strokeStyle = TRACK_COLOR;
    this.c.beginPath();
    this.c.moveTo(endPos, this.h / 2 - 4);
    this.c.lineTo(endPos, this.h / 2 + 4);
    this.c.stroke();

    // Draw progress head
    this.c.lineWidth = 7;
    this.c.fillStyle = TRACK_FILL_COLOR;
    this.c.beginPath();
    this.c.arc(this.w * 0.75, this.h / 2, 6, 0, Math.PI * 2);
    this.c.fill();
    this.c.stroke();
  }

  private drawTick(
    x: number,
    startX: number,
    endX: number,
    size: number = 12,
    label?: string,
  ) {
    if (x < 0.75 * this.w && x > startX) {
      this.c.strokeStyle = TRACK_FILL_COLOR;
    } else if (x > 0.75 && x < endX) {
      this.c.strokeStyle = TRACK_COLOR;
    } else {
      this.c.strokeStyle = UNFILLED_TRACK_COLOR;
    }

    this.c.beginPath();
    this.c.moveTo(x, this.h / 2 - size);
    this.c.lineTo(x, this.h / 2 + size);
    this.c.closePath();
    this.c.stroke();

    if (label && x < 0.75 * this.w) {
      const distanceToStart = this.w * 0.75 - x;

      this.c.save();
      this.c.globalAlpha = distanceToStart / this.w;
      this.c.fillStyle = TRACK_FILL_COLOR;
      this.c.font = "14px Instrument Serif";
      this.c.fillText(label, x + 2, this.h / 2 + size + 16);
      this.c.restore();
    }
  }

  private drawTicks(startX: number, endX: number) {
    this.c.lineWidth = 1;
    this.c.textAlign = "center";

    const timestep = (this.intervalValue / 1000) * PX_PER_SECOND * this.scale;
    const offset =
      ((this.t % this.intervalValue) / 1000) * PX_PER_SECOND * this.scale;
    const start = 0.75 * this.w - offset;

    // Draw ticks to left of current time
    let x = start;
    let i = 0;

    while (x > 0) {
      i++;

      this.drawTick(x, startX, endX, 12, `${i - 1}${this.intervalScale} ago`);
      x -= timestep / 2;
      this.drawTick(x, startX, endX, 6);
      x -= timestep / 2;
    }

    // Draw ticks to right of current time
    x = start;

    while (x < this.w) {
      this.drawTick(x, startX, endX);
      x += timestep / 2;
      this.drawTick(x, startX, endX, 6);
      x += timestep / 2;
    }
  }

  private drawEvents() {
    this.c.lineWidth = 2;
    this.c.lineCap = "round";
    // this.c.strokeStyle = HIGHLIGHT_COLOR;

    for (let i = 0; i < eventData.length; i++) {
      const event = eventData[i];

      const startPos = this.getXForTimestamp(event.startDate);
      const endPos = this.getXForTimestamp(event.endDate);

      if (startPos < 0 && endPos < 0) continue;

      if (event.status === "underway") {
        this.c.strokeStyle = UNDERWAY_EVENT_COLOR;
      } else if (event.status === "complete") {
        this.c.strokeStyle = COMPLETE_EVENT_COLOR;
      } else {
        this.c.strokeStyle = ABANDONED_EVENT_COLOR;
      }

      this.c.beginPath();
      this.c.moveTo(startPos, this.h / 2 - (event.layer + 1) * 10 - 12);
      this.c.lineTo(endPos, this.h / 2 - (event.layer + 1) * 10 - 12);
      this.c.stroke();
    }
  }

  private drawDebug(delta: number) {
    const windowWidth = Math.max(this.w / (PX_PER_SECOND * this.scale));

    this.c.font = "12px monospace";
    this.c.textAlign = "left";
    this.c.fillStyle = "#000";
    this.c.fillText(`Scale: ${this.scale.toFixed(8)}`, 10, 20);
    this.c.fillText(`Window span: ${windowWidth.toFixed(2)}s`, 10, 40);
    this.c.fillText(
      `Tick interval: ${this.intervalValue}ms (${this.intervalScale})`,
      10,
      60,
    );
    this.c.fillText(`Render time: ${delta.toFixed(2)}ms`, 10, 80);
    this.c.fillText(`t: ${this.t.toFixed(2)}ms`, 10, 100);
  }

  public draw(timestamp?: number, mx?: number) {
    const now = timestamp || Date.now();
    let dt = 0;

    if (this.lastFrameTime) {
      this.t = this.t + (now - this.lastFrameTime);
      dt = now - this.lastFrameTime;
    }

    this.lastFrameTime = now;

    if (this.scale !== this.targetScale) {
      this.scale = lerp(this.scale, this.targetScale, 0.01);
      this.computeWindow();
    }

    const startPos = this.getXForTimestamp(startDate);
    const endPos = this.getXForTimestamp(endDate);

    this.drawTicks(startPos, endPos);
    this.drawTrack(startPos, endPos);
    this.drawEvents();
    this.drawProgress(startPos, endPos);

    if (this.debug) this.drawDebug(dt);
  }

  public updateDimensions(newWidth: number, newHeight: number) {
    this.w = newWidth;
    this.h = newHeight;
    this.computeWindow();
  }
}
