<template>
    <div>
        <v-alert v-if="occuredError" text="Incorrect email or password" title="Alert title" type="error" />
        <H1> qqq</H1>
        <v-img
            class="mx-auto my-6"
            max-width="228"
            src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
        />

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
            />

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password

                <a
                    class="text-caption text-decoration-none text-blue"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Forgot login password?</a
                >
            </div>

            <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="visible = !visible"
            />

            <v-card class="mb-12" color="surface-variant" variant="tonal">
                <v-card-text class="text-medium-emphasis text-caption">
                    Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three
                    hours. If you must login now, you can also click "Forgot login password?" below to reset the login
                    password.
                </v-card-text>
            </v-card>

            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block to="/" @click="onClickLogin">
                Log In
            </v-btn>

            <v-card-text class="text-center">
                <a class="text-blue text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
                    Sign up now <v-icon icon="mdi-chevron-right" />
                </a>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import { inject } from "vue";
import { MarineApp } from "@/core/MarineApp";
import { type User } from "@/core";

let marineApp: MarineApp;

export default {
    setup() {
        marineApp = inject("marineApp") as MarineApp;
    },
    data: () => ({
        occuredError: false,
        visible: false
    }),
    watch: {
        "$store.state.user": function () {
            if (this.$store.state.user) {
                this.$router.push("/");
            }
        }
    },
    methods: {
        async onClickLogin() {
            console.warn("setup dummy user");

            const userPromise = marineApp.apiInterface.getUser("test@test.com", "test4321");

            userPromise.then((user: User) => {
                if (user) {
                    this.$store.dispatch("setUser", {
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                } else {
                    this.occuredError = true;
                }
            });
        }
    }
};
</script>
