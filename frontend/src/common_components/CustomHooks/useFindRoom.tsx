import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { RoomInfoType } from "../../utils/firebase";
import { fetchRoomList } from "../../page_components/Room/service/service";
import { setAPIError } from "../../features/apiStatSlice";
import { en } from "../../utils/language";

interface InitFindRoomState {
  rooms: Array<RoomInfoType>;
  nextRef: any;
}

interface FindRomState {
  isLoading: boolean;
  roomList: InitFindRoomState;
  fetchExistRooms: (_nextRef: any) => Promise<void>;
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
    async (_nextRef) => {
      setIsLoading(true);
      const res = await fetchRoomList(listFetchLimit, _nextRef);
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

  // Initial load when dialog is opened
  useEffect(() => {
    if (roomList.nextRef === null) {
      fetchExistRooms(roomList.nextRef);
    }
  }, [fetchExistRooms, roomList.nextRef]);

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
