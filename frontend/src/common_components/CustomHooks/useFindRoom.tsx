import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchRoomList } from "../../page_components/Room/service/service";
import useInit from "../CustomHooks/useInit";
import { setAPIError } from "../../features/apiStatSlice";
import { en } from "../../utils/language";
import {
  ApiReturnRes,
  SearchFilterState,
  RoomListState,
} from "../../utils/types";

interface FindRomState {
  isLoading: boolean;
  roomList: RoomListState;
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
  const [roomList, setRoomList] = useState<RoomListState>(initialState);

  // Fetch rooms which user can choose
  const fetchExistRooms = useCallback(
    async (_nextRef, filterObj, isReset = false) => {
      if (isReset) setRoomList(initialState);
      setIsLoading(true);
      const res = (await fetchRoomList(
        listFetchLimit,
        _nextRef,
        filterObj
      )) as ApiReturnRes<RoomListState>;

      if (res.isSuccess) {
        const { rooms: _rooms, nextRef } = res.value!;
        setRoomList((prevState) => ({
          rooms: prevState.rooms.concat(_rooms),
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
