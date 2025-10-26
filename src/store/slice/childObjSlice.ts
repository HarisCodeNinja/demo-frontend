import { ChildObj } from '@/interface/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const defaultObj: ChildObj = {
	open: false,
	filterKeys: {},
	label: ''
};
const initialState: Record<string, ChildObj> = {};

const childObjSlice = createSlice({
  name: 'childObj',
  initialState,
  reducers: {
		openChildDrawer(state:any, action: PayloadAction<{objKey:string, filterKeys:Record<string, any>, label: string}>) {   
		
		  const childObj: ChildObj = {
				open: true,
				filterKeys: action.payload.filterKeys,
				label: action.payload.label
			};

			state[action.payload.objKey] = childObj;
		},		
    resetChildObj(state:any, action: PayloadAction<string>) { 
			delete state[action.payload];
    },
  },
});


 export const {  resetChildObj, openChildDrawer} = childObjSlice.actions;

export default childObjSlice.reducer;
