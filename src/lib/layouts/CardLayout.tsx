import React, { ReactNode, ElementType } from "react";

type Variant = "default" | "info" | "success" | "warning" | "danger";
type Size = "sm" | "md" | "lg";

type CardLayoutProps<T extends ElementType = "div"> = {
  as?: T;                               // render as: div/section/article etc.
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;

  // quick knobs
  variant?: Variant;                    // bg/foreground preset (ignored if bgColor provided)
  size?: Size;                          // padding scale
  elevation?: 0 | 1 | 2 | 3;            // shadow depth
  bordered?: boolean;                   // adds border
  hoverable?: boolean;                  // hover shadow
  divider?: boolean;                    // add hairline between sections
  rounded?: string;                     // default: rounded-2xl

  // layout defaults (overridable)
  width?: string;                       // default: w-full max-w-md
  height?: string;                      // default: min-h-[200px]
  padding?: string;                     // overrides size
  bgColor?: string;                     // overrides variant
  textColor?: string;

  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

// tiny helper – join only truthy class strings (no external lib)
function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function CardLayout<T extends ElementType = "div">({
  as,
  header,
  body,
  footer,

  variant = "default",
  size = "md",
  elevation = 1,
  bordered = false,
  hoverable = false,
  divider = false,
  rounded = "rounded-2xl",

  width = "w-full max-w-md",
  height = "min-h-[200px]",
  padding,
  bgColor,
  textColor,

  className,
  ...rest
}: CardLayoutProps<T>) {
  const Comp = (as || "div") as ElementType;

  const sizePad =
    size === "sm" ? "p-3" : size === "lg" ? "p-6" : "p-4";

  const shadow =
    elevation === 0 ? "shadow-none"
    : elevation === 1 ? "shadow-sm"
    : elevation === 2 ? "shadow-md"
    : "shadow-lg";

  const variantBg =
    variant === "info" ? "bg-blue-50"
    : variant === "success" ? "bg-emerald-50"
    : variant === "warning" ? "bg-amber-50"
    : variant === "danger" ? "bg-rose-50"
    : "bg-white";

  const variantText =
    variant === "info" ? "text-blue-900"
    : variant === "success" ? "text-emerald-900"
    : variant === "warning" ? "text-amber-900"
    : variant === "danger" ? "text-rose-900"
    : "text-gray-900";

  const base = cx(
    "flex flex-col transition-all",
    width,
    height,
    rounded,
    hoverable && "hover:shadow-lg",
    bordered && "border border-gray-200",
    padding ? padding : sizePad,
    bgColor ? bgColor : variantBg,
    textColor ? textColor : variantText,
    shadow,
    className
  );

  const sectionSep = divider ? "border-t border-gray-200/70" : "";

  return (
    <Comp className={base} {...rest}>
      {header && <div className={cx(divider && "pb-3", divider && "border-b border-gray-200/70")}>{header}</div>}
      {body && <div className="flex-1">{body}</div>}
      {footer && <div className={cx(sectionSep, divider ? "pt-3" : "")}>{footer}</div>}
    </Comp>
  );
}
