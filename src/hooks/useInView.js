import { useEffect, useRef, useState } from "react";

/**
 * Observes an element and flips to true the first time it enters the
 * viewport (by `threshold`). Stays true afterwards — used to trigger
 * scroll-in animation sequences exactly once.
 */
export function useInView(threshold = 0.28) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}
