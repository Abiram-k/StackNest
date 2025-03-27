import { useState } from "react";
import ReactPaginate from "react-paginate";

type paginationType = {
  totalPages: number;
  onPageChange: (value: number) => void;
};

const Pagination = ({ totalPages, onPageChange }: paginationType) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    onPageChange(selected + 1);
  };

  return (
    <div className="mt-5">
      <ReactPaginate
        className="flex justify-center items-center space-x-2 mt-4"
        breakLabel="..."
        nextLabel="Next"
        previousLabel="Previous"
        onPageChange={handlePageChange}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        containerClassName="flex flex-wrap  justify-center gap-2"
        pageClassName="flex items-center border rounded dark:text-white"
        pageLinkClassName="px-4 py-2  rounded-md cursor-pointer text-sm transition duration-200"
        previousClassName="flex items-center"
        previousLinkClassName="px-4 py-2 border cursor-pointer rounded-md text-sm  transition duration-200"
        nextClassName="flex items-center"
        nextLinkClassName="px-4 py-2 border rounded-md cursor-pointer text-sm  transition  duration-200"
        activeClassName="bg-primary-500 dark:bg-primary-600  text-white"
      />
    </div>
  );
};

export default Pagination;
