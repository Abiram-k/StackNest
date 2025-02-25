import { spiral } from "ldrs";

export const Spinner = () => {
  spiral.register();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      <l-spiral size="50" speed="0.9" color="#5B52E5"></l-spiral>
    </div>
  );
};
