import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  AppRoutes,
  ScrollToTop,
  ErrorBoundary,
  UserProvider,
} from "./components";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <BrowserRouter>
            <UserProvider />
            <ScrollToTop>
              <AppRoutes />
            </ScrollToTop>
          </BrowserRouter>
        </ErrorBoundary>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>
);
