import { useEffect, useState } from "react";

const mobileBoundary = 480;

const useDetectMobile = (): boolean => {
    const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

    const handleResize = () => setInnerWidth(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // If screen size is smaller than mobileBoundary.
    return innerWidth <= mobileBoundary;
};

export default useDetectMobile;