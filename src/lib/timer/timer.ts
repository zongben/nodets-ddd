import { performance } from "node:perf_hooks";
import { AsyncLocalStorage } from "node:async_hooks";

type TimeSpan = {
  id: number;
  label: string;
  start: number;
  end?: number;
  duration?: number;
};

export class Timer {
  private _timeSpans: TimeSpan[] = [];
  private index = 0;

  start(label: string): number {
    const id = this.index++;
    this._timeSpans.push({ id, label, start: performance.now() });
    return id;
  }

  end(id: number): TimeSpan | undefined {
    const timeSpan = this.getTimeSpan(id);
    if (timeSpan) {
      timeSpan.end = performance.now();
      timeSpan.duration = timeSpan.end - timeSpan.start;
    }
    return timeSpan;
  }

  getTimeSpan(id: number): TimeSpan | undefined {
    return this._timeSpans.find((ts) => ts.id === id);
  }

  getAllTimeSpans(): TimeSpan[] {
    return this._timeSpans;
  }
}

export const timerStorage = new AsyncLocalStorage<Timer>();
