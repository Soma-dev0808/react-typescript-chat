import React, { useState } from 'react';
import { handleScroll, addPropsToChildren } from '../../utils/utilities';
import NoWrapLoadingIndicator from '../NoWrapLoadingIndicator';

import { SearchFilterState } from '../../utils/types';
import { FindRomState } from '../CustomHooks/useFindRoom';
import { en } from '../../utils/language';
import './ScrollableRoomList.scss';

interface ScrollableRoomListProps {
    refProp?: React.RefObject<HTMLDivElement>;
    filterObj?: SearchFilterState;
    cls?: string;
    useFindRoom: FindRomState;
}

// Wrapper of scrollable chat list. 
const ScrollableRoomList: React.FC<ScrollableRoomListProps> = ({
    refProp = null, // ref for an element.
    cls = '', // class names
    filterObj = {}, // filter object for fetching room list.
    useFindRoom, // this is an object from useFindRoom.
    children // children which to be rendered is item of chat list.
}) => {
    const [isBottom, setIsBottom] = useState<boolean>(false);
    const { isLoading, roomList, fetchExistRooms } = useFindRoom;

    // Check if a list is scrolled to bottom, then fetch additional rooms.
    const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
        handleScroll(e, (_isBottom) => {
            // when reached bottom, update state and load more items.
            if (isBottom !== _isBottom) {
                if (
                    !isBottom &&
                    !isLoading &&
                    roomList.nextRef !== null &&
                    roomList.nextRef !== -1
                ) {
                    fetchExistRooms(roomList.nextRef, filterObj);
                }
                setIsBottom(_isBottom);
            }
        });
    };

    // Show this when no result.
    const renderNoResult = (): JSX.Element | null => {
        if (!isLoading && !roomList.rooms.length) {
            return (
                <div className="scrollable-list-no-result">
                    {en.NO_RESULT}
                </div>
            );
        }

        return null;
    };

    const noResultComponent = renderNoResult();

    return (
        <div
            ref={refProp}
            className={cls}
            onScroll={handleListScroll}
        >

            {/* This will be showed when there's not chat list items */}
            {noResultComponent}

            {/* Create react clone element to pass props to the child component. */}
            {addPropsToChildren(children, roomList)}

            {/* Show loading indicator at the bottom of the list */}
            {isLoading && <NoWrapLoadingIndicator />}

        </div>
    );
};

export default ScrollableRoomList;