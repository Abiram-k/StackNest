export const EmailSendedSuccess = ({
    email,
    setIsSuccess,
  }: {
    email: string;
    setIsSuccess: (value: boolean) => void;
  }) => {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Check your email
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          We've sent a password reset link to
          <br />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {email}
          </span>
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors cursor-pointer"
        >
          Back to reset form
        </button>
      </div>
    );
  };
  