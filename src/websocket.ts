import { WebSocketServer } from 'ws';
// @ts-ignore
export default (req, res) => {
 
  const wss = new WebSocketServer({ noServer: true });

// @ts-ignore
 
  res.socket.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  
  wss.on('connection', (socket) => {
    console.log('A new client connected');

    // Handle incoming messages from clients
    socket.on('message', (message) => {
      console.log('Received: %s', message);
      socket.send(`Echo: ${message}`);
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Send a response when the function is triggered (though WebSocket logic is handled separately)
  res.status(200).send('WebSocket server is running');
};
