import { useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset pagination when filters change
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Add this to your return statement
  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const getActiveCount = useCallback(() => {
    return Array.from(searchParams.entries()).filter(
      ([k]) => !["page"].includes(k),
    ).length;
  }, [searchParams]);

  return { getParam, updateFilter, updateFilters, clearAll, getActiveCount };
}
