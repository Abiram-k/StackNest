export const AiIcon = ({
  generateAIContent,
  name,
  toolTipString,
}: {
  generateAIContent?: (name: string) => void;
  name: string;
  toolTipString?: string;
}) => {
  return (
    <div className="group">
      <div className="absolute right-1 -top-5 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-900 text-white text-xs rounded px-2 py-1 z-30 whitespace-nowrap">
        {toolTipString || " Generate content based on the title !"}
      </div>
      <div
        className="absolute right-5 top-5 -translate-y-1/2 text-blue-500 cursor-pointer transition duration-300 hover:scale-110 hover:text-blue-600 text-2xl animate-ai-glow"
        onClick={() => generateAIContent?.(name)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    </div>
  );
};
