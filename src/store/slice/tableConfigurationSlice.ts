import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: Record<string, any> = {};

const tableConfigurationSlice = createSlice({
  name: 'tableConfiguration',
  initialState,
  reducers: {
    setTableConfiguration(state, action: PayloadAction<{name: string, data: any}>) {   
			state[action.payload.name] = action.payload.data;
			return state;
    },
  },
});

export const { setTableConfiguration} = tableConfigurationSlice.actions;

export default tableConfigurationSlice.reducer;
