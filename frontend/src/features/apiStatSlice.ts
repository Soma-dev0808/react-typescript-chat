import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface ApiErrorState {
  isApiLoading: boolean;
  apiErrorMessages: Array<string> | string | null;
  redirectPath: string | null;
}

const initialState: ApiErrorState = {
  isApiLoading: false,
  apiErrorMessages: null,
  redirectPath: null,
};

export const apiStatSlice = createSlice({
  name: "apiStatus",
  initialState: {
    apiStatus: initialState,
  },
  reducers: {
    startOrEndCallApi: (state, action: PayloadAction<boolean>) => {
      const { apiErrorMessages, redirectPath } = state.apiStatus;
      state.apiStatus = {
        isApiLoading: action.payload,
        apiErrorMessages: action.payload ? null : apiErrorMessages,
        redirectPath: action.payload ? null : redirectPath,
      };
    },
    setAPIError: (state, action: PayloadAction<Partial<ApiErrorState>>) => {
      const newState: ApiErrorState = {
        isApiLoading: false,
        apiErrorMessages: null,
        redirectPath: null,
      };
      if (action.payload.apiErrorMessages) {
        newState.apiErrorMessages = action.payload.apiErrorMessages;
      }
      if (action.payload.redirectPath) {
        newState.redirectPath = action.payload.redirectPath;
      }
      state.apiStatus = newState;
    },
    clearError: (state) => {
      state.apiStatus.apiErrorMessages = null;
      state.apiStatus.redirectPath = null;
    },
  },
});

export const {
  startOrEndCallApi,
  setAPIError,
  clearError,
} = apiStatSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectApiStatus = (state: RootState) => state.apiStatus.apiStatus;

export default apiStatSlice.reducer;
