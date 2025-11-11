// import { throttle } from "lodash";
// import { useLayoutEffect, useMemo, useRef, useState } from "react";

// /**
//  * Smoothly follows `target` with an exponential damping / smoothing.
//  * State updates are throttled for fewer React re-renders.
//  *
//  * @param target number to follow (px, rem, whatever number-space you use)
//  * @param tau time constant in seconds (smaller = faster). e.g. 0.08
//  * @param eps snap threshold. When |target - value| < eps we snap to target.
//  * @param fps max updates per second (default 30)
//  */
// export function useDampedValue(
//   target: number,
//   tau = 0.08,
//   eps = 0.5,
//   fps = 60
// ) {
//   const [value, setValue] = useState<number>(target);

//   const valueRef = useRef<number>(value);
//   const targetRef = useRef<number>(target);
//   const frameRef = useRef<number | null>(null);
//   const lastTimeRef = useRef<number | null>(null);

//   // throttled setter (memoized so stable across renders)
//   const throttledSetValue = useMemo(
//     () => throttle(setValue, 1000 / fps, { leading: true, trailing: true }),
//     [fps]
//   );

//   // keep refs up to date
//   useLayoutEffect(() => {
//     targetRef.current = target;
//     if (frameRef.current == null) {
//       lastTimeRef.current = performance.now();
//       frameRef.current = requestAnimationFrame(tick);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [target]);

//   useLayoutEffect(() => {
//     valueRef.current = value;
//   }, []); // init once

//   useLayoutEffect(() => {
//     return () => {
//       if (frameRef.current != null) {
//         cancelAnimationFrame(frameRef.current);
//         frameRef.current = null;
//       }
//       throttledSetValue.cancel();
//     };
//   }, [throttledSetValue]);

//   function tick(now: number) {
//     const last = lastTimeRef.current ?? now;
//     const dt = Math.max(0, (now - last) / 1000); // seconds
//     lastTimeRef.current = now;

//     const cur = valueRef.current;
//     const tgt = targetRef.current;
//     const diff = tgt - cur;

//     if (Math.abs(diff) <= eps) {
//       valueRef.current = tgt;
//       throttledSetValue(tgt);
//       frameRef.current = null;
//       return;
//     }

//     const alpha = 1 - Math.exp(-dt / Math.max(1e-6, tau));
//     const next = cur + diff * alpha;

//     valueRef.current = next;
//     throttledSetValue(next);

//     frameRef.current = requestAnimationFrame(tick);
//   }

//   return value;
// }
