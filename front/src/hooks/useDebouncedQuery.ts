import { useEffect, useState } from 'react';

function isEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useDebouncedQuery(
  search: string,
  admissions: number[] | string[],
  delay = 200
) {
  const [debouncedQuery, setDebouncedQuery] = useState({ search, admissions });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery((prev) => {
        const newQuery = { search, admissions };
        if (isEqual(prev, newQuery)) {
          return prev;
        }
        return newQuery;
      });
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [search, admissions, delay]);

  return debouncedQuery;
}
