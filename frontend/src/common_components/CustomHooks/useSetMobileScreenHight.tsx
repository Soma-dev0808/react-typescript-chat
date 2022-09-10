import { useCallback, useEffect } from "react";
import useDetectMobile from "./useDetectMobile";

// Mobile screens have different innerHeights, so adjust screen size for them.
const useSetMobileScreenHight = () => {
    const isMobile = useDetectMobile();

    // Get innerHeight which is actual visible screen area size.
    const appHeight = useCallback(() => {
        if (!isMobile) return;
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }, [isMobile]);

    useEffect(() => {
        const doc = document.documentElement;
        const currAppHeight = doc.style.getPropertyValue('--app-height');

        // If there's no --app-height set yet, call appHeight to set initial css value. 
        if (currAppHeight === '') {
            appHeight();
        }

        window.addEventListener('resize', appHeight);

        return () => { window.removeEventListener('resize', appHeight); };
    }, [appHeight]);
};

export default useSetMobileScreenHight;