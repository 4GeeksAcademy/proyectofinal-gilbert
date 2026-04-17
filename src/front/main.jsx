import React, { useReducer } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import storeReducer, { initialStore, Context } from "./store";
import "./index.css";

const Main = () => {
    const [state, dispatch] = useReducer(storeReducer, initialStore());

    return (
        <Context.Provider value={{ store: state, dispatch }}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </Context.Provider>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);