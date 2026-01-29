import { createContext, useContext, useEffect } from "react";
import { socket } from "../sockets/socket";
import { useAuth } from "../hooks/UseAuthHook";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const handleConnect = () => {
            console.log("SOCKET CONNECTED");

            if (user.role === "Admin") {
                console.log(" Joining admins room");
                socket.emit("join", "admins");
            }

            if (user.role === "Moderator") {
                console.log(" Joining moderator room");
                socket.emit("join", `user_${user.id}`);
            }
        };

        socket.on("connect", handleConnect);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
