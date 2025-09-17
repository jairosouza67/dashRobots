
'use client';

import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent",
        className
      )}
    />
  );
}

// Add the shimmer animation to your CSS
const shimmerCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

// You can add this CSS to your index.css or create a separate CSS file
