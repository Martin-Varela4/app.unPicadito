import { useState, useEffect } from "react";

/**
 * @param {string} value
 * @param {number} delay - milisegundos de espera
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};