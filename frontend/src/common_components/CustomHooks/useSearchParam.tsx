import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type UseSearchParamType = (key: string) => string | null;

// Custom hook to get search query string from location.
const useSearchParam: UseSearchParamType = (key) => {
    const [searchParam, setSearchPram] = useState<string | null>(null);
    const location = useLocation().search;

    useEffect(() => {
        setSearchPram(new URLSearchParams(location).get(key));
    }, [location, key]);

    return searchParam;
};

export default useSearchParam;
