import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            signined: false
        };
    },
    mutations: {
        signin(state: any) {
            state.signined = true;
        }
    }
});

export default store;
