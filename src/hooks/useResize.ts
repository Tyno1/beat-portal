import { useCallback, useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 900, 
  md: 1045,
  lg: 1280,
  xl: 1440,
} as const;

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.sm) return "sm";
  if (width < BREAKPOINTS.md) return "md";
  if (width < BREAKPOINTS.lg) return "lg";
  if (width < BREAKPOINTS.xl) return "xl";
  return "2xl";
};

const useResize = () => {
  const [size, setSize] = useState(window.innerWidth);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getBreakpoint(window.innerWidth)
  );

  const handleResize = useCallback(() => {
    const newSize = window.innerWidth;
    setSize(newSize);
    setBreakpoint(getBreakpoint(newSize));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return { size, breakpoint };
};

export default useResize;
