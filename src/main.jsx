import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes, ScrollToTop, ErrorBoundary } from "./components";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <ScrollToTop>
                    <AppRoutes />
                </ScrollToTop>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
