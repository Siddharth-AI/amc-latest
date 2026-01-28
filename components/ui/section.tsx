import { cn } from "@/lib/utils";
import { type ReactNode, forwardRef } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "mobile" | "tablet" | "desktop";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, padding = "desktop" }, ref) => {
    const paddingClasses = {
      none: "",
      mobile: "py-section-mobile",
      tablet: "py-section-tablet",
      desktop: "py-section-desktop",
    };

    return (
      <section
        ref={ref}
        className={cn(paddingClasses[padding], className)}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

