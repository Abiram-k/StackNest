export const FallBackTable = ({
  mainTitle,
  subTitle,
}: {
  mainTitle: string;
  subTitle: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8  border-none rounded-lg mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {mainTitle || "Not available"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {subTitle || "Get started by uploading a new "}
      </p>
    </div>
  );
};
