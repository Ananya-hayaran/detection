import { useEffect, useState } from "react";

/**
 * Returns true after `delay` ms have elapsed since mount.
 * Used to stagger page-load reveal animations.
 */
export function useReveal(delay = 0) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return visible;
}
