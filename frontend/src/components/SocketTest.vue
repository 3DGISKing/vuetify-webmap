<script setup lang="ts">
import { ref, watch } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

// Receive message handler
socket.on("receive_message", (data: any) => {
    console.info("received message", data);
});

const roomID = ref("");
const message = ref("");
const sendBtnDisabled = ref(true);
const messageInputDisabled = ref(true);

let currentRoom = "";

function handleJoin() {
    console.log(roomID.value);

    const room = roomID.value;

    if (room) {
        socket.emit("join_room", room);

        currentRoom = room;

        sendBtnDisabled.value = false;
        messageInputDisabled.value = false;
    }
}

function handleSend() {
    const messageVal = message.value;

    if (messageVal && currentRoom) {
        const data = {
            room: currentRoom,
            content: messageVal,
            time: new Date().toLocaleTimeString()
        };

        socket.emit("send_message", data);

        message.value = "";
    }
}
</script>

<template>
    <v-date-picker hide-header></v-date-picker>
    <div>
        <!-- <input type="text" id="roomInput" placeholder="Room ID" /> -->

        <v-text-field v-model="roomID" label="Room ID" type="input"></v-text-field>
        <v-btn @click="handleJoin"> Join Room </v-btn>
    </div>

    <div>
        <!-- <input type="text" id="messageInput" placeholder="Message" disabled /> -->
        <v-text-field v-model="message" label="Message" type="input" :disabled="messageInputDisabled"></v-text-field>
        <v-btn @click="handleSend" :disabled="sendBtnDisabled"> Send</v-btn>
    </div>
</template>

<style scoped>
.v-text-field {
    width: 400px;
}
</style>
