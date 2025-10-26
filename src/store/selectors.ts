// selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

const selectChildObj = (state: RootState) => state.childObj;
const selectSelectedObj = (state: RootState) => state.selectedObj;

export const selectFilterKeys = (obj:string) => createSelector(
  [selectChildObj],
  (childObj) => childObj[`child${obj}`]?.filterKeys ?? {}
);

export const selectSelectedObjState = createSelector(
  [selectSelectedObj],
  (selectedObj) => ({
    openDrawer: selectedObj.openDrawer,
    hasSelected: selectedObj.hasSelected,
    primaryKeys: selectedObj.primaryKeys,
    objName: selectedObj.objName,
  })
);
