import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchRoomList } from "../../page_components/Room/service/service";
import useInit from "../CustomHooks/useInit";
import { setAPIError } from "../../features/apiStatSlice";
import {
  ApiReturnRes,
  SearchFilterState,
  RoomListState,
} from "../../utils/types";
import { NextRefType } from "../../utils/firebase";
import { en } from "../../utils/language";

export interface FindRomState {
  isLoading: boolean;
  roomList: RoomListState;
  fetchExistRooms: (
    _nextRef: NextRefType,
    filterObj: SearchFilterState,
    isReset?: boolean
  ) => Promise<void>;
}

const initialState: RoomListState = {
  rooms: [],
  nextRef: null,
};

const useFindRoom = (isPersonal = false, listFetchLimit = 10): FindRomState => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<RoomListState>(initialState);

  // Fetch rooms which user can choose
  const fetchExistRooms = useCallback(
    async (
      _nextRef: NextRefType,
      filterObj: SearchFilterState,
      isReset: boolean = false
    ) => {
      // Reset room list.
      if (isReset) setRoomList(initialState);

      setIsLoading(true);

      // Set isPersonal to the filter object 
      filterObj.isPersonal = isPersonal;

      const res: ApiReturnRes<RoomListState> = await fetchRoomList(
        listFetchLimit,
        _nextRef,
        filterObj
      );

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
    [dispatch, isPersonal, listFetchLimit]
  );

  // custom hook to fetch roomlist during initial loading.
  useInit(fetchExistRooms, roomList.nextRef, {});

  // unset roomList when unmounting
  useEffect(() => {
    return () => setRoomList(initialState);
  }, []);

  return { isLoading, roomList, fetchExistRooms };
};

export default useFindRoom;
