import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectModeratorSocket = (userId: number) => {
    if (!socket) {
        socket = io("http://localhost:5000", {
            transports: ["websocket"],
            forceNew: true,
        });

        socket.on("connect", () => {
            console.log("Moderator socket connected:", socket?.id);
            socket?.emit("join", `user_${userId}`);
        });

        
        socket.on("quiz_rejected", (data) => {
            console.log("Moderator received quiz_rejected:", data);

            window.dispatchEvent(
                new CustomEvent("moderator-notification", { detail: data })
            );
        });

        socket.on("disconnect", () => {
            console.log("Moderator socket disconnected");
        });
    }

    return socket;
};

export const disconnectModeratorSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
