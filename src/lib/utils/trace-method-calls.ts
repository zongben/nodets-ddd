import { timerStorage } from "../timer/timer";

export function TrackMethodCalls(): ClassDecorator {
  return (target: any) => {
    const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
      (name) =>
        name !== "constructor" && typeof target.prototype[name] === "function",
    );

    for (const name of methodNames) {
      const original = target.prototype[name];

      target.prototype[name] = function (...args: any[]) {
        const timer = timerStorage.getStore();
        if (!timer) {
          return;
        }
        const label = `${target.name}.${name}`;
        const id = timer.start(label);

        try {
          const result = original.apply(this, args);
          return result instanceof Promise
            ? result.finally(() => timer.end(id))
            : (timer.end(id), result);
        } catch (err) {
          timer.end(id);
          throw err;
        }
      };
    }
  };
}
