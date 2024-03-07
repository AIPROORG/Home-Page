import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const nextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prevPageNumber => prevPageNumber + 1);
      }
  };

  const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prevPageNumber => prevPageNumber - 1);
      }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
        <div className="pagination">
            <button className="pagination-button" onClick={prevPage}>Prev</button>
            <button className="pagination-button" onClick={nextPage}>Next</button>
        </div>
        <div className="pagination-dots">
            {Array.from({ length: totalPages }, (_, index) => (
            <span
                key={index}
                className={`pagination-dot ${index + 1 === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(index + 1)}
            />
            ))}
        </div>
    </div>
  );
};

export default Pagination;