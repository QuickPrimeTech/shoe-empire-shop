// @/hooks/use-media-query.ts

"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to track the state of a CSS media query.
 * @param query The media query string to monitor (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid hydration mismatch
  // (Server has no window, so it defaults to false)
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value on mount
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Modern listener for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}
