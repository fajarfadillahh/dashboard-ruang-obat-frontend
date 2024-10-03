import { useMemo, useState } from "react";

interface PaginatedData<T> {
  pages: number;
  page: number;
  data: T[];
  setPage: (page: number) => void;
}

export default function usePagination<T>(
  data: T[],
  rowsPerPage: number,
): PaginatedData<T> {
  const [page, setPage] = useState(1);

  const pages = useMemo(
    () => Math.ceil(data.length / rowsPerPage),
    [data.length, rowsPerPage],
  );
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data, rowsPerPage]);

  return {
    pages,
    page,
    data: items,
    setPage,
  };
}
