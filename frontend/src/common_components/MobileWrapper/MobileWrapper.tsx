import React from 'react';

interface MobileWrapperProps {
    isMobile: boolean;
    wrapperCls: string;
}

// When the screen is for mobile, add div element to create clickable background area.
const MobileWrapper: React.FC<MobileWrapperProps> = React.memo(({
    children,
    wrapperCls,
    isMobile,
}) => {

    // If it's not mobile, just return children in fragemnt.
    const Wrapper = !isMobile
        ? <> {children} </>
        : <div className={wrapperCls}>
            {children}
        </div>;

    return Wrapper;
});

export default MobileWrapper;