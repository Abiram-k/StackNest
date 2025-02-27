import { spiral } from "ldrs";

export const Spinner = () => {
  spiral.register();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 dark:bg-black/70 text-primary-500 dark:text-primary-600 z-[9999]">
      <l-spiral size="50" speed="0.9" color="currentColor" ></l-spiral>
    </div>
  );
};

