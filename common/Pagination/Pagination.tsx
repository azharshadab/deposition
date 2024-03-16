import { HTMLAttributes, useId } from 'react';
import { StyledPagination } from './Styles';

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  setRowCount: (rowCount: number) => void;
  rowCount: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  rowCount,
  setRowCount,
  ...rest
}: PaginationProps) => {
  const handlePrevClick = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    handlePageChange(currentPage + 1);
  };

  const rowInputId = useId();

  return (
    <StyledPagination {...rest} data-testid="pagination">
      <button
        data-testid="pagination-prev"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        {'<'} Prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        if (
          page === 1 ||
          page === 2 ||
          page === 3 ||
          page === totalPages ||
          page === currentPage
        ) {
          return (
            <button
              key={page}
              data-testid="page-btn"
              className={`page-btn ${currentPage === page ? 'current' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        }
        if (
          page === 4 ||
          (currentPage !== 1 &&
            currentPage !== 2 &&
            currentPage !== 3 &&
            currentPage !== totalPages &&
            page === currentPage + 1)
        ) {
          return <span key={`ellipsis-${page}`}> ... </span>;
        }
        return null;
      })}
      <button
        data-testid="pagination-next"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next {'>'}
      </button>
      <label htmlFor={rowInputId} className="row-label">
        Rows Per Page:
        <select
          value={rowCount}
          onChange={e => {
            setRowCount(parseInt(e.target.value));
            handlePageChange(1);
          }}
          id={rowInputId}
          data-testid="rows-input"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </StyledPagination>
  );
};

export default Pagination;
