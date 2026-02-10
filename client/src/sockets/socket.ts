import { io, Socket } from "socket.io-client";

const SOCKET_URL: string = import.meta.env.VITE_API_URL;


export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});
