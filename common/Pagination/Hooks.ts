import { useState, useMemo } from 'react';

function usePagination<T = any>(sortedItems: T[], pageLength = 10) {
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(pageLength);

  const totalPages = useMemo(
    () => Math.ceil(sortedItems.length / rowCount),
    [sortedItems.length, rowCount],
  );

  const shouldPaginate = useMemo(
    () => sortedItems.length > pageLength,
    [sortedItems.length, pageLength],
  );

  return {
    page,
    setPage,
    rowCount,
    setRowCount,
    totalPages,
    shouldPaginate,
  };
}

export default usePagination;
