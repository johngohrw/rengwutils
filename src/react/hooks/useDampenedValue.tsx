import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DampedValue } from "../../classes";

type DampenedValueOptions = {
  initialValue?: number;
  tau?: number;
  eps?: number;
  fps?: number;
};

export const useDampenedValue = (
  onUpdate: (value: number) => void,
  {
    tau = 0.1,
    eps = 0.5,
    fps = 60,
    initialValue = 0,
  }: DampenedValueOptions = {}
) => {
  const damperRef = useRef<DampedValue | null>(null);

  // stable setTarget wrapper that waits until damper exists
  const setTarget = useCallback((target: number) => {
    damperRef.current?.setTarget(target);
  }, []);

  useEffect(() => {
    damperRef.current = new DampedValue(initialValue, onUpdate, {
      tau,
      eps,
      fps,
    });

    return () => {
      damperRef.current?.stop();
      damperRef.current = null;
    };
  }, []);

  return setTarget;
};

export const useDampenedValueSimple = (
  target: number,
  options: DampenedValueOptions = {}
) => {
  const [damped, setDamped] = useState(options.initialValue ?? 0);
  const setTarget = useDampenedValue(setDamped, options);
  useLayoutEffect(() => setTarget(target), [setTarget, target]);

  return damped;
};
