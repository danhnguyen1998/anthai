import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SearchState} from './state';

export const initialSearchState: SearchState = {
  ngay_ct: '',
  so_ct: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchOrder: (state: SearchState, action: PayloadAction<{so_ct: string; ngay_ct: string}>) => ({
      ...state,
      ngay_ct: action.payload.ngay_ct,
      so_ct: action.payload.so_ct,
    }),
  },
});

export const {setSearchOrder} = searchSlice.actions;

export default searchSlice.reducer;
