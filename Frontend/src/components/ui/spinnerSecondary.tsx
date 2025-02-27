import { lineSpinner } from "ldrs";

export const spinnerSecondary = () => {
  lineSpinner.register();
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      ></l-line-spinner>
    </div>
  );
};

