import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState("");
  let a = 1;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  return debounceValue;
};
