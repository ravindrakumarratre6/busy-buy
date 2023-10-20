import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/userReducer";
import { productsReducer } from "./Reducers/productsReducer";
import { myCartReducer } from "./Reducers/myCartReducer";

export const store = configureStore({
    reducer: {
        userReducer,
        productsReducer,
        myCartReducer,
    },
})

