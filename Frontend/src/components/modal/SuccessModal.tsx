import type React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Success",
  message = "Your Account has been successfully updated!",
  buttonText = "Continue",
}) => {
  if (!isOpen) return null;

  const handleOnClose = () => {
    isOpen = false;
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleOnClose}
      ></div>
      <div className="relative bg-gray-900 rounded-3xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="px-6 py-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-1">
            {title}
            <span className="block text-green-400">Successful</span>
          </h2>

          <p className="text-gray-400 text-sm mt-4 mb-6 max-w-xs mx-auto">
            {message}
          </p>

          <button
            onClick={handleOnClose}
            className="w-full py-3 px-4 rounded-full font-medium text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
