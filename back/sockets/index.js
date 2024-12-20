import { Server } from "socket.io";
import { allowedOrigins } from "../utils/constants.js";

export default (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Gestion des événements de WebSocket
    socket.on("message", (data) => {
      console.log("Message received:", data);
      // Traitez le message et utilisez `socket.emit` ou `io.emit` pour répondre ou diffuser.
      socket.emit("response", { message: "Message received" });
    });

    socket.on("broadcast", (data) => {
      console.log("Broadcast message:", data);
      // Exemple d'envoi de message à tous les clients
      io.emit("broadcastResponse", { message: "Broadcast message received" });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Vous pouvez ajouter des écouteurs d'événements supplémentaires ici
  });
};
