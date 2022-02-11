import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { RoomInfoType } from "../../utils/firebase";
import { fetchRoomList } from "../../page_components/Room/service/service";
import useInit from "../CustomHooks/useInit";
import { setAPIError } from "../../features/apiStatSlice";
import { en } from "../../utils/language";
import { SearchFilterState } from "../../utils/types";

interface InitFindRoomState {
  rooms: Array<RoomInfoType>;
  nextRef: any;
}

interface FindRomState {
  isLoading: boolean;
  roomList: InitFindRoomState;
  fetchExistRooms: (
    _nextRef: any,
    filterObj: SearchFilterState,
    isReset?: boolean
  ) => Promise<void>;
}

const listFetchLimit = 10;
const initialState = {
  rooms: [],
  nextRef: null,
};

const useFindRoom = (): FindRomState => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<InitFindRoomState>(initialState);

  // Fetch rooms which user can choose
  const fetchExistRooms = useCallback(
    async (
      _nextRef,
      filterObj: SearchFilterState,
      isReset: boolean = false
    ) => {
      if (isReset) setRoomList(initialState);
      setIsLoading(true);
      const res = await fetchRoomList(listFetchLimit, _nextRef, filterObj);
      if (res.isSuccess) {
        const { roomList, nextRef } = res.value;
        setRoomList((prevState) => ({
          rooms: prevState.rooms.concat(roomList),
          nextRef: nextRef,
        }));
      } else {
        dispatch(setAPIError({ apiErrorMessages: en.FETCH_DATA_ERROR }));
      }
      setIsLoading(false);
    },
    [dispatch]
  );

  // custom hook to fetch roomlist during initial loading.
  useInit(fetchExistRooms, roomList.nextRef, {});

  // unset roomList when unmounting
  useEffect(() => {
    const resetState = () => {
      setRoomList(initialState);
    };

    return () => resetState();
  }, []);

  return { isLoading, roomList, fetchExistRooms };
};

export default useFindRoom;
