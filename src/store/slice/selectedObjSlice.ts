import { SelectedObj } from '@/interface/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Record<string, SelectedObj> = {}

const defaultObj: SelectedObj = {
  showView: false,
  showForm: false,
  showEdit: false,
  showDelete: false,
  keys: {},
  primaryKeys: {},
  label: '',
};

interface SetInfoPayload {
  keys?: Record<string, any>;
  primaryKeys: Record<string, any>;
  label: string;
  objKey: string;
}
interface SetFormPayload {
	keys?: Record<string, any>;
	objKey: string;
  }

const setInfo = (state: Record<string, SelectedObj>, action: PayloadAction<SetInfoPayload>, viewType: 'showView' | 'showEdit' | 'showDelete'| 'showForm') => {
  state[action.payload.objKey] = {
    ...defaultObj,
    [viewType]: true,
    keys: action.payload.keys || {},
	  primaryKeys: action.payload.primaryKeys,
    label: action.payload.label,
  };
};

const selectedObjSlice = createSlice({
  name: 'selectedObj',
  initialState,
  reducers: {
    updateSelectedObj(state: Record<string, SelectedObj>, action: PayloadAction<Record<string, SelectedObj>>) {
      return action.payload;
    },
    setForView(state: Record<string, SelectedObj>, action: PayloadAction<SetInfoPayload>) {
      setInfo(state, action, 'showView');
    },
    setForEdit(state: Record<string, SelectedObj>, action: PayloadAction<SetInfoPayload>) {
      setInfo(state, action, 'showEdit');
    },
    setForDelete(state: Record<string, SelectedObj>, action: PayloadAction<SetInfoPayload>) {
      setInfo(state, action, 'showDelete');
    },	
    openNewForm(state: Record<string, SelectedObj>, action: PayloadAction<SetFormPayload>) {
          state[action.payload.objKey] = {
            ...defaultObj,
            showForm: true,
            keys: action.payload.keys || {},
            };
	  },
    resetSelectedObj(state: Record<string, SelectedObj>, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const {  resetSelectedObj, setForView, setForEdit, setForDelete, openNewForm, updateSelectedObj } = selectedObjSlice.actions;

export default selectedObjSlice.reducer;