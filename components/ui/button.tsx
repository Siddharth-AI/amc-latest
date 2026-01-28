import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef, type ReactElement, cloneElement, isValidElement } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      children,
      asChild,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary",
      secondary:
        "bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-11 px-8 text-lg",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      disabled && "opacity-50 cursor-not-allowed",
      className
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<any>, {
        className: cn(classes, (children as ReactElement<any>).props.className),
        ...props,
      });
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

