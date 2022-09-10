import { useCallback, useEffect } from "react";
import useDetectMobile from "./useDetectMobile";

const useSetMobileScreenHight = () => {
    const isMobile = useDetectMobile();
    const appHeight = useCallback(() => {
        if (!isMobile) return;
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }, [isMobile]);

    useEffect(() => {
        const doc = document.documentElement;
        const currAppHeight = doc.style.getPropertyValue('--app-height');

        if (currAppHeight === '') {
            appHeight();
        }

        window.addEventListener('resize', appHeight);

        return () => { window.removeEventListener('resize', appHeight); };
    }, [appHeight]);
};

export default useSetMobileScreenHight;