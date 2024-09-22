import { useSearchParams, usePathname } from "next/navigation";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "~/app/_components/users-table";

const cleanEmptyParams = <T extends Record<string, unknown>>(search: T) => {
  const newSearch = { ...search };
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key];
    if (
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value))
    )
      delete newSearch[key];
  });

  if (search.pageIndex === DEFAULT_PAGE_INDEX) delete newSearch.pageIndex;
  if (search.pageSize === DEFAULT_PAGE_SIZE) delete newSearch.pageSize;

  return newSearch;
};

export const useFilters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = new URLSearchParams(searchParams.toString());

  const setFilters = (partialFilters: Record<string, string>) => {
    const queries = new URLSearchParams(cleanEmptyParams(partialFilters));
    window.history.pushState(null, "", `?${queries.toString()}`);
  };

  const resetFilters = () => window.history.pushState(null, "", pathname);

  return { filters, setFilters, resetFilters };
};
