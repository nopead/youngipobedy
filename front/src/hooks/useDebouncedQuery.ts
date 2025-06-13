import { useEffect, useState } from 'react';

export function useDebouncedQuery(search: string, admissions: number[] | string[], delay = 200) {
  const [debouncedQuery, setDebouncedQuery] = useState({ search, admissions });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery({ search, admissions });
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [search, admissions, delay]);

  return debouncedQuery;
}
