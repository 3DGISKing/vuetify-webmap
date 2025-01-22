import { createStore } from "vuex";
import type { User } from "@/core";

type AppState = {
    user: User | undefined;
};

const store = createStore({
    state() {
        return {
            user: undefined
        };
    },
    mutations: {
        updateUser(state: AppState, payload: User) {
            state.user = payload;
        }
    },
    actions: {
        setUser(context, payload: User) {
            context.commit("updateUser", payload);
        }
    }
});

export default store;
