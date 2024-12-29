import { WebSocket, WebSocketServer } from "ws";

// Create WebSocket Server on port 8080
const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

// Array to track all connected users and their rooms
let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("A new client connected.");

  // Listen for messages from the client
  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      // Handle "join" messages to associate a user with a room
      if (parsedMessage.type === "join") {
        console.log(`User joined room: ${parsedMessage.payload.roomId}`);
        allSockets.push({
          socket,
          room: parsedMessage.payload.roomId,
        });
      }

      // Handle "chat" messages to broadcast to users in the same room
      if (parsedMessage.type === "chat") {
        console.log("Received chat message:", parsedMessage.payload.message);

        // Find the user's current room
        const user = allSockets.find((user) => user.socket === socket);
        if (!user) return;

        // Broadcast message to all users in the same room
        allSockets.forEach((userInRoom) => {
          if (userInRoom.room === user.room) {
            userInRoom.socket.send(parsedMessage.payload.message);
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Handle client disconnection
  socket.on("close", () => {
    console.log("A client disconnected.");

    // Remove the disconnected user from the array
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
