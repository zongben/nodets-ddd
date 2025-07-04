import { performance } from "node:perf_hooks";
import { AsyncLocalStorage } from "node:async_hooks";

type TimeSpan = {
  label: string;
  start: number;
  end?: number;
  duration?: number;
};

export class Timer {
  private _timeSpans: TimeSpan[] = [];

  start(label: string): void {
    const existing = this.getTimeSpan(label);
    if (existing) {
      existing.start = performance.now();
      existing.end = undefined; // Reset end time if already exists
      existing.duration = undefined; // Reset duration if already exists
      return;
    }
    this._timeSpans.push({ label, start: performance.now() });
  }

  end(label: string): TimeSpan | undefined {
    const timeSpan = this.getTimeSpan(label);
    if (timeSpan) {
      timeSpan.end = performance.now();
      timeSpan.duration = timeSpan.end - timeSpan.start;
    }
    return timeSpan;
  }

  getTimeSpan(label: string): TimeSpan | undefined {
    return this._timeSpans.find((ts) => ts.label === label);
  }

  getAllTimeSpans(): TimeSpan[] {
    return this._timeSpans;
  }
}

export const timerStorage = new AsyncLocalStorage<Timer>();
