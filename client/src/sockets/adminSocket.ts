import { io, Socket } from "socket.io-client";

let adminSocket: Socket | null = null;

export const connectAdminSocket = () => {
    if (!adminSocket) {
        adminSocket = io("http://localhost:5000", {
            transports: ["websocket"],
            withCredentials: true,
        });
    }

    return adminSocket;
};

export const disconnectAdminSocket = () => {
    if (adminSocket) {
        adminSocket.disconnect();
        adminSocket = null;
    }
};
