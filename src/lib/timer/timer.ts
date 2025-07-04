import { performance } from "node:perf_hooks";
import { AsyncLocalStorage } from "node:async_hooks";
import { guid } from "../utils/guid";

type TimeSpan = {
  id: string;
  label: string;
  start: number;
  end?: number;
  duration?: number;
};

export class Timer {
  private _timeSpans: TimeSpan[] = [];

  start(label: string): string {
    const id = guid();
    this._timeSpans.push({ id, label, start: performance.now() });
    return id;
  }

  end(id: string): TimeSpan | undefined {
    const timeSpan = this.getTimeSpan(id);
    if (timeSpan) {
      timeSpan.end = performance.now();
      timeSpan.duration = timeSpan.end - timeSpan.start;
    }
    return timeSpan;
  }

  getTimeSpan(id: string): TimeSpan | undefined {
    return this._timeSpans.find((ts) => ts.id === id);
  }

  getAllTimeSpans(): TimeSpan[] {
    return this._timeSpans;
  }
}

export const timerStorage = new AsyncLocalStorage<Timer>();
