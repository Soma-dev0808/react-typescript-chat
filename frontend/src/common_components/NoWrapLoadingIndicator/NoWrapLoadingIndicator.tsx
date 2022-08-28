import React from 'react';
import { classNames } from '../../utils/utilities';

import './NoWrapLoadingIndicator.scss';

interface NoWrapLoadingIndicatorProps {
    isCentred?: boolean;
}

const NoWrapLoadingIndicator: React.FC<NoWrapLoadingIndicatorProps> = ({ isCentred = true }) => (
    <div className={classNames({ 'nowrapp-loading-indicator-centered': isCentred })}>
        <div className="nowrapp-loading-indicator" />
    </div>
);

export default NoWrapLoadingIndicator;