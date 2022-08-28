import { useRef, useEffect, useState } from "react";

const useDropdown = () => {
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

export default useDropdown;