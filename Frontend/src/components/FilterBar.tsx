import { Search } from "lucide-react";
import { useState } from "react";

type optionType = {
  value: string;
  label?: string;
};
type filterBarPropsType = {
  setSearchQuery: (value: string) => void;
  setFilterQuery: (value: string) => void;
  setSortedOrder: (value: string) => void;
  filterOptions?: optionType[];
  sortOptions?: optionType[];
};

const FilterBar = ({
  setSearchQuery,
  setFilterQuery,
  filterOptions,
  setSortedOrder,
  sortOptions,
}: filterBarPropsType) => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full md:max-w-lg flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-14 py-3 border -1 dark:border-gray-300 border-gray-300 rounded-full focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchQuery(e.target.value);
          }}
        />

        <button
          onClick={() => setSearchQuery(search)}
          className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 px-4 py-3 bg-gray-100 border-r border-2 dark:bg-transparent rounded-r-full hover:bg-gray-200 transition"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex gap-4 w-full md:w-auto ">
        {filterOptions && (
          <div className="relative w-full sm:w-48">
            <select
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white appearance-none focus:outline-none focus:ring-2  focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200 cursor-pointer [&>option]:bg-white [&>option]:text-gray-800 dark:bg-black"
            >
              <option value="" className="dark:bg-black dark:text-white">
                Filter by
              </option>
              {filterOptions?.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  className="dark:bg-black dark:text-white"
                >
                  {option.label || option.value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
        {sortOptions && (
          <div className="relative w-full sm:w-48">
            <select
              onChange={(e) => setSortedOrder(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200 dark:bg-transparent cursor-pointer [&>option]:bg-white [&>option]:text-gray-800"
            >
              <option value="" className="dark:bg-black dark:text-white">
                Select Order
              </option>
              {sortOptions?.map((option, index) => (
                <option
                  key={index}
                  className="dark:bg-black dark:text-white"
                  value={option.value}
                >
                  {option.label || option.value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
