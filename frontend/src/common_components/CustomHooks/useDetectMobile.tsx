import { useEffect, useState } from "react";

const useDetectMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);


    const handleResize = () => {
        if (window.innerWidth <= 480) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile;
};

export default useDetectMobile;