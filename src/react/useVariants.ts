import { CSSProperties } from "react";
import { combine } from "../object";

export const useVariants = <T extends ComponentVariants>(
  selectedVariants: (keyof T)[],
  inputVariants: T
) => {
  const appliedVariants = selectedVariants.map(
    (variant) => inputVariants[variant]
  );
  const variantClasses = appliedVariants.map((v) => v.className);
  const variantStyles = combine(...appliedVariants.map((v) => v.style));

  return { appliedVariants, variantClasses, variantStyles };
};

export type ComponentVariants = {
  [key: string]: {
    className: string;
    style: CSSProperties;
  };
};
