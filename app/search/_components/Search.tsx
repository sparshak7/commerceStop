"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export const revalidate = 0;

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [perm, setPerm] = useState<null | string>(null);
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPerm(localStorage.getItem("verify"));
      const storedSearches =
        JSON.parse(localStorage.getItem("searches")!) || [];
      setSearches(storedSearches);
    }
  }, []);

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
      if (perm) {
        const searchTermPattern = new RegExp(term, "i");
        if (!searches.some((search) => searchTermPattern.test(search))) {
          const updatedSearches = [...searches, term];
          if (updatedSearches.length > 5) {
            updatedSearches.shift();
          }
          localStorage.setItem("searches", JSON.stringify(updatedSearches));
          setSearches(updatedSearches);
        }
      }
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="p-2">
      <Input
        type="text"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        placeholder="Example: Playstation 5"
        className="placeholder:text-gray-600 mb-4"
      />
      {perm && (
        <div className="flex flex-wrap gap-2 items-center p-2">
          {searches.length > 2 && <h3>Recently Searched: </h3>}
          {searches.length > 2 &&
            searches.map((search, index) => (
              <Badge
                key={index}
                onClick={() => {
                  handleSearch(search);
                }}
                className="bg-accent rounded-full px-2 py-1 text-secondary-foreground cursor-pointer"
              >
                {search}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};
export default Search;
