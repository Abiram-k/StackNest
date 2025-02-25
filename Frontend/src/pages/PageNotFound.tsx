import { Link } from 'react-router-dom';

export const PageNotFound = () => {
    
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-9xl font-bold text-primary-500 dark:text-primary-600 opacity-90">
          404
        </h1>

        <div className="mt-8 space-y-4">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-300">
            Oops! Lost in the Stack?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, our servers are just as confused as you are 🥴🤖
          </p>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-primary-500 hover:bg-[#4a43c4] 
            rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg
            dark:bg-primary-600 dark:hover:bg-[#4a43c4]/90"
          >
            Return to Safe Code
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            stackNest © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};