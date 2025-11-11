import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DivEl } from "../../types/htmlElements";
import { combine } from "../../../object";
import { isNullish } from "../../../bools";
import { useDampenedValue } from "../../hooks";

export type StoryboardFrame = {
  height: CSSProperties["height"];
  items: {
    align?: Align;
    anchor?: Anchor;
    easingLag?: number;
    element?: ReactNode;
  }[];
};

type StoryboardDebugOptions = {
  items?: boolean;
  frames?: boolean;
};

export const StoryboardRenderer = ({
  frames,
  debug,
}: {
  frames: StoryboardFrame[];
  debug?: StoryboardDebugOptions;
}) => {
  return (
    <Storyboard>
      {frames.map((frame, i) => (
        <Frame
          key={`${i}-${frame.items.length}`}
          {...{ debug }}
          height={frame.height}
        >
          {frame.items.map((item, j) => {
            const { element, ...restProps } = item;
            return (
              <Positioned key={`${i}-${j}`} {...{ debug }} {...restProps}>
                {element}
              </Positioned>
            );
          })}
        </Frame>
      ))}
    </Storyboard>
  );
};

export const Storyboard = ({ children }: DivEl) => {
  return (
    <div
      style={
        {
          position: "relative",
          "-webkit-font-smoothing": "antialiased",
        } as any
      }
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
  debug?: StoryboardDebugOptions;
}) => {
  return (
    <div
      style={combine(
        { position: "relative", height, width },
        debug?.frames && { border: "1px solid black" }
      )}
    >
      {children}
    </div>
  );
};

type Align = {
  center?: boolean;
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  top?: CSSProperties["top"];
  bottom?: CSSProperties["bottom"];
};

const getAlignCss = (align?: Align) => {
  const result = combine<CSSProperties>(
    align?.center && {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    !isNullish(align?.bottom) && { bottom: align.bottom, top: undefined },
    !isNullish(align?.top) && { top: align.top },
    !isNullish(align?.right) && { right: align.right, left: undefined },
    !isNullish(align?.left) && { left: align.left }
  );
  return result;
};

type Anchor = {
  center?: boolean;
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  top?: CSSProperties["top"];
  bottom?: CSSProperties["bottom"];
};

const getAnchorCss = (anchor?: Anchor) => {
  const hasLeftRight = !isNullish(anchor?.left || anchor?.right);
  const hasTopBottom = !isNullish(anchor?.top || anchor?.bottom);
  const result = combine<CSSProperties>(
    anchor?.center && {
      top: hasTopBottom ? undefined : "0",
      left: hasLeftRight ? undefined : "0",
      transform: `
          translateX(${hasLeftRight ? "0" : `-50%`}) 
          translateY(${hasTopBottom ? "0" : `-50%`})
        `,
    },
    !isNullish(anchor?.bottom) && { bottom: anchor.bottom, top: undefined },
    !isNullish(anchor?.top) && { top: anchor.top },
    !isNullish(anchor?.right) && { right: anchor.right, left: undefined },
    !isNullish(anchor?.left) && { left: anchor.left }
  );

  return result;
};

export const Positioned = ({
  children,
  align,
  anchor,
  easingLag,
  debug,
}: DivEl & {
  align?: Align;
  anchor?: Anchor;
  easingLag?: number;
  debug?: StoryboardDebugOptions;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, rerender] = useState(1);
  useLayoutEffect(() => rerender((p) => p + 1), []);

  return (
    <>
      <div
        ref={ref}
        style={combine(
          { position: "absolute" },
          debug?.items && {
            width: "3px",
            height: "3px",
            background: "red",
            borderRadius: "50%",
          },
          getAlignCss(align)
        )}
      ></div>
      {ref.current &&
        (easingLag ? (
          <PositionedInnerEased
            targetEl={ref.current}
            anchor={anchor}
            easingLag={easingLag}
          >
            {children}
          </PositionedInnerEased>
        ) : (
          <PositionedInner targetEl={ref.current} anchor={anchor}>
            {children}
          </PositionedInner>
        ))}
    </>
  );
};

type PositionedCoords = { x: number; y: number };
const PositionedInner = ({
  targetEl,
  anchor,
  children,
}: DivEl & {
  targetEl: HTMLElement;
  anchor?: Anchor;
}) => {
  const getRefRect = () => targetEl.getBoundingClientRect();
  const [coords, setCoords] = useState<PositionedCoords>(getRefRect());

  useEffect(() => {
    const updatePos = () => setCoords({ x: getRefRect().x, y: getRefRect().y });
    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        transform: `translate(${coords.x}px,${coords.y}px)`,
        top: 0,
        bottom: 0,
        willChange: "transform",
      }}
    >
      <div style={{ position: "absolute", ...getAnchorCss(anchor) }}>
        {children}
      </div>
    </div>
  );
};

const PositionedInnerEased = ({
  targetEl,
  anchor,
  children,
  easingLag = 0.1,
  fps = 120,
}: DivEl & {
  targetEl: HTMLElement;
  anchor?: Anchor;
  easingLag?: number;
  fps?: number;
}) => {
  const getRefRect = () => targetEl.getBoundingClientRect();
  const [coords, setCoords] = useState<PositionedCoords>(getRefRect());
  const setTargetX = useDampenedValue((x) => setCoords((p) => ({ ...p, x })), {
    tau: easingLag,
    eps: 0.5,
    fps,
    initialValue: coords.x,
  });
  const setTargetY = useDampenedValue((y) => setCoords((p) => ({ ...p, y })), {
    tau: easingLag,
    eps: 0.5,
    fps,
    initialValue: coords.y,
  });

  useEffect(() => {
    const updatePos = () => {
      const rect = getRefRect();
      setTargetX(rect.x);
      setTargetY(rect.y);
    };

    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        transform: `translate(${coords.x}px,${coords.y}px)`,
        top: 0,
        bottom: 0,
        willChange: "transform",
      }}
    >
      <div style={{ position: "absolute", ...getAnchorCss(anchor) }}>
        {children}
      </div>
    </div>
  );
};
