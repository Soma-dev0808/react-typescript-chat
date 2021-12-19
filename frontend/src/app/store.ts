import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import apiStatusReducer from "../features/apiStatSlice";

export const store = configureStore({
  reducer: {
    apiStatus: apiStatusReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
