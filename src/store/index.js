import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
// import logger from "redux-logger";
import persistReducer from "redux-persist/es/persistReducer";

import authReducer from "@/features/auth/authSlice";
import { postsApi } from "@/features/posts/postsAPI";
import persistStore from "redux-persist/es/persistStore";
import { setupListeners } from "@reduxjs/toolkit/query";
import { topicsAPI } from "@/features/topicsAPI";
import { baseApi } from "@/features/baseApi";

const rootConfig = {
  key: "root",
  storage,
  blacklist: ["topicsAPI", "postsApi"],
  // whitelist
};

const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const store = configureStore({
  reducer: persistReducer(rootConfig, rootReducer),
  // Kết hợp giữa cấu hình lưu trữ (config) và reducer chính (reducer) để tạo ra một reducer mới, có khả năng lưu state vào storage
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
    baseApi.middleware,
    // postsApi.middleware,
    // topicsAPI.middleware,
    // ...getDefaultMiddleware trải mảng các middleware mặc định đc return từ getDefaultMiddleware
    // logger,
    // Thêm logger vào list middleware
  ],
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
// persistStore(store) gắn cơ chế lưu trữ vào store
export default store;
