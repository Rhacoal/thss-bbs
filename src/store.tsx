import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserSelf} from "./backend";

export interface Store {
    user: UserSelf | null,
    token: string | null,
}

export const userSlice = createSlice({
    name: "user",
    initialState: null as (UserSelf | null),
    reducers: {
        updateUserStatus(state, action: PayloadAction<UserSelf | null>) {
            return action.payload;
        },
    }
});

export const tokenSlice = createSlice({
    name: "token",
    initialState: localStorage.getItem("token"),
    reducers: {
        setToken(state: string | null, action: PayloadAction<string | null>) {
            if (action.payload != null) {
                localStorage.setItem("token", action.payload);
            } else {
                localStorage.removeItem("token");
            }
            return action.payload;
        }
    }
})

export const store = configureStore<Store>({
    reducer: {
        user: userSlice.reducer,
        token: tokenSlice.reducer,
    }
})
