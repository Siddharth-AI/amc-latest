import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({ children, className, padding = "md", hover = false }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-card",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-surface shadow-sm transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

