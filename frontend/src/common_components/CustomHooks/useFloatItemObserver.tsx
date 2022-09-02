import { useRef, useEffect, useState } from "react";

// Show floating item like modal and put ref to the background of the page which make user to close it.
const useFloatItemObserver = () => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current?.contains(e.target as Node | null)) {
            setIsShow(false);
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutside, true);

        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { isShow, setIsShow, ref };
};

export default useFloatItemObserver;