import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface IToolTipProviderProps {
  trigger: string;
  title: string;
  content: string;
}

const ToolTipProvider = ({
  trigger,
  title,
  content,
}: IToolTipProviderProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="text-gray-600 font-medium cursor-pointer hover:text-primary transition-colors text-sm">
         {trigger}
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white text-sm rounded-lg shadow-lg p-3 w-64">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-gray-300">
            {content}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTipProvider;
