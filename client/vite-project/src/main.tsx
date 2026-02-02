import React from "react";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import { Provider } from "react-redux";
import store from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Provider store={ store }>
                    <App />
                </Provider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
)
