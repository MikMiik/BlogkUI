import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
// import logger from "redux-logger";
import persistReducer from "redux-persist/es/persistReducer";

import authReducer from "@/features/auth/authSlice";
// import productsReducer from "@/features/products/productsSlice";
import persistStore from "redux-persist/es/persistStore";

const rootConfig = {
  key: "root",
  storage,
  // blacklist,
  // whitelist
};

const rootReducer = combineReducers({
  auth: authReducer,
  // products: productsReducer,
});

const store = configureStore({
  reducer: persistReducer(rootConfig, rootReducer),
  // Kết hợp giữa cấu hình lưu trữ (config) và reducer chính (reducer) để tạo ra một reducer mới, có khả năng lưu state vào storage
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
    // ...getDefaultMiddleware trải mảng các middleware mặc định đc return từ getDefaultMiddleware
    // logger,
    // Thêm logger vào list middleware
  ],
});

export const persistor = persistStore(store);
// persistStore(store) gắn cơ chế lưu trữ vào store
export default store;
