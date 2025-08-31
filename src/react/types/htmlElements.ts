import { ComponentProps } from "react";

export type El<T extends keyof React.JSX.IntrinsicElements> = ComponentProps<T>;

export type DivEl = El<"div">;
export type SpanEl = El<"span">;
export type InputEl = El<"input">;
export type ImgEl = El<"img">;
export type VideoEl = El<"video">;
export type AudioEl = El<"audio">;
export type ButtonEl = El<"button">;
export type CanvasEl = El<"canvas">;
export type EmbedEl = El<"embed">;
export type FormEl = El<"form">;
export type TableEl = El<"table">;
