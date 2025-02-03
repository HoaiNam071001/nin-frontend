import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UtilsState {
  keyword: string;
}

const initialState: UtilsState = {
  keyword: "",
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    changeKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
  },
});

export const utilsAction = { ...utilsSlice.actions };

export default utilsSlice.reducer;
