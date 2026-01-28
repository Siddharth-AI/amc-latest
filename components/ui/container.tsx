import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "container" | "full";
}

export function Container({
  children,
  className,
  maxWidth = "container",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidth === "container" && "max-w-container",
        className
      )}
    >
      {children}
    </div>
  );
}

