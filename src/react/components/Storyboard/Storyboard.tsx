import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { combine, isNullish } from "rengwutils";
import { DivEl } from "../../types";
import { useDampenedValue } from "../../hooks";

export type StoryboardFrame = {
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  items: StoryboardItemProps[];
};

type Align = {
  center?: boolean;
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  top?: CSSProperties["top"];
  bottom?: CSSProperties["bottom"];
};

type StoryboardItemProps = {
  align?: Align;
  easingLag?: number;
  element?: ReactNode;
  unclickable?: boolean;
  style?: CSSProperties;
};

export const StoryboardRenderer = ({
  frames,
  debug,
}: {
  frames: StoryboardFrame[];
  debug?: boolean;
}) => {
  return (
    <Storyboard>
      {frames.map((frame, i) => (
        <Frame
          key={`${i}-${frame.items.length}`}
          height={frame.height}
          width={frame.width}
          debug={debug}
        >
          {frame.items.map((item, j) => {
            return <Positioned key={`${i}-${j}`} item={item} debug={debug} />;
          })}
        </Frame>
      ))}
    </Storyboard>
  );
};

export const Storyboard = ({ children }: DivEl) => {
  return (
    <div
      style={{
        position: "relative",
        ["-webkit-font-smoothing" as string]: "antialiased",
      }}
    >
      {children}
    </div>
  );
};

export const Frame = ({
  children,
  height = "auto",
  width = "100%",
  debug,
}: DivEl & {
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  debug?: boolean;
}) => {
  return (
    <div
      style={combine(
        { position: "relative", height, width },
        debug && { border: "1px solid black" }
      )}
    >
      {children}
    </div>
  );
};

export const Positioned = ({
  item,
  debug,
}: { item: StoryboardItemProps; debug?: boolean } & DivEl) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, rerender] = useState(1);
  useLayoutEffect(() => rerender((p) => p + 1), []);

  const { center, ...align } = item.align ?? {};
  let alignment: CSSProperties = {};
  if (center) {
    if (isNullish(align.bottom)) alignment.top = "50%";
    if (isNullish(align.right)) alignment.left = "50%";
  }
  alignment = { ...alignment, ...align };

  return (
    <>
      <div
        ref={ref}
        style={combine(
          { position: "absolute", ...alignment },
          debug && {
            width: "3px",
            height: "3px",
            background: "red",
            borderRadius: "50%",
          }
        )}
      />
      {ref.current && <PositionedAux item={item} targetEl={ref.current} />}
    </>
  );
};

type PositionedCoords = { x: number; y: number };

const PositionedAux = ({
  targetEl,
  item,
}: DivEl & {
  targetEl: HTMLElement;
  item: StoryboardItemProps;
}) => {
  const getRefRect = () => targetEl.getBoundingClientRect();
  const [coords, setCoords] = useState<PositionedCoords>(getRefRect());

  const setTargetY = useDampenedValue((y) => setCoords((p) => ({ ...p, y })), {
    tau: item.easingLag ?? 0,
    eps: 0.5,
    fps: 120,
    initialValue: coords.y,
  });

  useEffect(() => {
    const updatePos = () => {
      const rect = getRefRect();
      setCoords((p) => ({ ...p, x: rect.x }));
      setTargetY(rect.y);
    };

    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, []);

  const { center, ...align } = item.align ?? {};
  let translate = { x: "0%", y: "0%" };
  if (center) translate = { x: "-50%", y: "-50%" };
  if (!isNullish(align.left)) translate.x = "0%";
  if (!isNullish(align.right)) translate.x = "-100%";
  if (!isNullish(align.bottom)) translate.y = "-100%";
  if (!isNullish(align.top)) translate.y = "0%";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `
          translate(
            calc(${coords.x}px + ${translate.x}), 
            calc(${coords.y}px + ${translate.y}))
        `,
        pointerEvents: item.unclickable ? "none" : "auto",
        willChange: "transform",
        ...item.style,
      }}
    >
      {item.element}
    </div>
  );
};
