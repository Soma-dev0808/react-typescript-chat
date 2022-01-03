import { useState, useEffect } from "react";

// Custom hook for the case when you want to call function only during the initial loading and don't want to set a dipendency of the useEffect.
const useInit = (callBack: (...cbArgs: any) => any, ...args: any[]): void => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      callBack(...args);
    }
  }, [mounted, callBack, args]);
};

export default useInit;
