// q@ts-nocheck
/* qeslint-disable */

import axios from "axios";

const serverUrl = "http://localhost:3500";

class APIInterface {
    constructor() {}

    async getUser(email: string, password: string) {
        try {
            const { data } = await axios.post(`${serverUrl}/api/v1/users/login`, {
                email: email,
                password: password
            });

            return data.data.user;
        } catch (error: unknown) {
            console.error(error);
            return null;
        }
    }
}

export default APIInterface;
