import { io, Socket } from "socket.io-client";

let adminSocket: Socket | null = null;

export const connectAdminSocket = (): Socket => {
    if (adminSocket?.connected) {
        console.log("Socket already connected, reusing");
        return adminSocket;
    }

    if (adminSocket) {
        console.log("Cleaning up disconnected socket");
        adminSocket.disconnect();
        adminSocket = null;
    }

    console.log("Creating new socket connection");

    adminSocket = io("http://localhost:5000", {
        transports: ["polling"],
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        upgrade: false,
    });

    adminSocket.on("connect", () => {
        console.log("Admin socket connected:", adminSocket?.id);
    });

    adminSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    adminSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);

        if (reason === "io server disconnect") {
            adminSocket?.connect();
        }
    });

    adminSocket.on("error", (error) => {
        console.error("Socket error:", error);
    });

    return adminSocket;
};

export const disconnectAdminSocket = (): void => {
    if (adminSocket) {
        console.log("Disconnecting admin socket");
        adminSocket.disconnect();
        adminSocket = null;
    }
};

export const getAdminSocket = (): Socket | null => {
    return adminSocket;
};