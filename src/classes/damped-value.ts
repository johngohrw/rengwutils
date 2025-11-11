/**
 * Smoothly follows a target numeric value using exponential damping.
 * Emits damped values via a callback, updating on animation frames.
 */
export class DampedValue {
  private value: number;
  private target: number;
  private tau: number;
  private eps: number;
  private fps: number;
  private frameId: number | null = null;
  private lastTime: number | null = null;
  private onUpdate: (value: number) => void;
  private throttledEmit: (value: number) => void;
  private cancelThrottle: () => void;

  constructor(
    initial: number,
    onUpdate: (value: number) => void,
    {
      tau = 0.08, // smaller = faster
      eps = 0.5, // snap threshold
      fps = 60, // max updates per second
    }: {
      tau?: number;
      eps?: number;
      fps?: number;
    } = {}
  ) {
    this.value = initial;
    this.target = initial;
    this.tau = tau;
    this.eps = eps;
    this.fps = fps;
    this.onUpdate = onUpdate;

    const [emit, cancel] = this.createThrottle(onUpdate, 1000 / fps);
    this.throttledEmit = emit;
    this.cancelThrottle = cancel;
  }

  /** Set a new target to follow */
  setTarget(target: number) {
    this.target = target;
    if (this.frameId == null) {
      this.lastTime = performance.now();
      this.frameId = requestAnimationFrame(this.tick);
    }
  }

  /** Stop updating */
  stop() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.cancelThrottle();
  }

  /** Internal animation tick */
  private tick = (now: number) => {
    const last = this.lastTime ?? now;
    const dt = Math.max(0, (now - last) / 1000); // seconds
    this.lastTime = now;

    const diff = this.target - this.value;

    if (Math.abs(diff) <= this.eps) {
      this.value = this.target;
      this.throttledEmit(this.value);
      this.frameId = null;
      return;
    }

    const alpha = 1 - Math.exp(-dt / Math.max(1e-6, this.tau));
    this.value += diff * alpha;

    this.throttledEmit(this.value);
    this.frameId = requestAnimationFrame(this.tick);
  };

  /** Simple throttle implementation */
  private createThrottle<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): [(...args: Parameters<T>) => void, () => void] {
    let lastCall = 0;
    let timeout: number | null = null;
    let lastArgs: Parameters<T> | null = null;

    const invoke = (...args: Parameters<T>) => {
      lastCall = performance.now();
      fn(...args);
    };

    const throttled = (...args: Parameters<T>) => {
      const now = performance.now();
      const remaining = delay - (now - lastCall);
      lastArgs = args;

      if (remaining <= 0) {
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        invoke(...args);
      } else if (timeout == null) {
        timeout = window.setTimeout(() => {
          timeout = null;
          if (lastArgs) invoke(...lastArgs);
        }, remaining);
      }
    };

    const cancel = () => {
      if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
      }
    };

    return [throttled, cancel];
  }
}
