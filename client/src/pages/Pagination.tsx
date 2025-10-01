// DummyPaginationRelative.tsx
import React, { useState } from "react";

const Pagination = () => {
  const totalPages = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous */}
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full"
      >
        <span className="w-6 h-6 transform rotate-90 inline-block">▲</span>
      </button>

      {/* Pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`flex items-center justify-center w-24 h-16 rounded-full border border-white/0 font-medium text-xl ${
            currentPage === page
              ? "bg-white/10 border-white text-white"
              : "bg-white/10 text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full"
      >
        <span className="w-6 h-6 transform -rotate-90 inline-block">▲</span>
      </button>
    </div>
  );
};

export default Pagination;
