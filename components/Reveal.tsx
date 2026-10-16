"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const FROM = {
  up: "translateY(140px) rotate(4deg) scale(.9)",
  left: "translateX(-24vw) rotate(-5deg)",
  pop: "scale(.15) rotate(-40deg)",
  soft: "translateY(70px) rotate(1.5deg)",
  // For tall blocks: any rotation swings their edges past the screen, so rise and fade only.
  fade: "translateY(24px)",
} as const;

type Props = {
  as?: ElementType;
  variant?: keyof typeof FROM;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [k: string]: unknown;
};

/** Springy scroll-in reveal. Content stays in the DOM (SEO); hidden until it enters the viewport. */
export default function Reveal({ as: Tag = "div", variant = "up", delay = 0, style, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    el.style.opacity = "0";
    el.style.transform = FROM[variant];
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const soft = variant === "soft" || variant === "fade";
        el.style.transition = soft
          ? "transform 1s cubic-bezier(.2,1.1,.3,1), opacity .7s ease"
          : `transform 1.2s cubic-bezier(.2,1.25,.3,1) ${delay}ms, opacity .8s ease ${delay}ms`;
        el.style.opacity = "1";
        el.style.transform = "none";
      },
      { threshold: variant === "soft" ? 0.15 : 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant, delay]);

  return (
    <Tag ref={ref} style={style} {...rest}>
      {children}
    </Tag>
  );
}
