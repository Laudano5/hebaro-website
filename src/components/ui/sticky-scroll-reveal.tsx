"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

type StickyScrollItem = {
  number?: string;
  title: string;
  description: string;
  content?: React.ReactNode;
};

export const StickyScroll = ({
  content,
  contentClassName,
  className,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
  className?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!content.length) return;
    const nextCard = Math.min(content.length - 1, Math.floor(latest * content.length));
    setActiveCard((current) => current === nextCard ? current : nextCard);
  });

  return (
    <div className={cn("sticky-scroll-root", className)} ref={ref}>
      <div className="sticky-scroll-list">
        {content.map((item, index) => (
          <article className="sticky-scroll-item" data-active={activeCard === index} key={`${item.title}-${index}`}>
            <motion.div
              animate={{ opacity: activeCard === index ? 1 : 0.46, y: activeCard === index ? 0 : 5 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              <span className="sticky-scroll-number">{item.number ?? `0${index + 1}`}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
            {item.content && <div className="sticky-scroll-mobile-visual">{item.content}</div>}
          </article>
        ))}
      </div>
      <div className={cn("sticky-scroll-canvas", contentClassName)}>
        {content[activeCard]?.content && (
          <motion.div
            className="sticky-scroll-canvas-content"
            key={activeCard}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: "easeOut" }}
          >
            {content[activeCard].content}
          </motion.div>
        )}
      </div>
    </div>
  );
};
