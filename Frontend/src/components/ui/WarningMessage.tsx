import { AlertTriangle } from "lucide-react";

const WarningMessage = ({message}: {message:string}) => {
  return (
    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-md animate-fade-in">
      <AlertTriangle className="w-5 h-5 text-yellow-500" />
      <p className="text-sm font-medium">{message} </p>
    </div>
  );
};

export default WarningMessage;
