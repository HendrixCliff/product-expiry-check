import { combineReducers } from "@reduxjs/toolkit";
import medicineSlice from "./pharmacySlice"

export const rootReducer = combineReducers({
    medicine: medicineSlice
  });
  
  export type RootState = ReturnType<typeof rootReducer>;
  