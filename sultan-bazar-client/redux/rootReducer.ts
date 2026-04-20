import { baseApi } from "./api/baseApi";
import localCartReducer from "./features/localCartSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  localCart: localCartReducer,
};
