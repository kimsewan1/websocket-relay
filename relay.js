const WebSocket = require('ws');

const PORT = process.env.PORT || 10000;

const server = new WebSocket.Server({ port: PORT }, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);  
});

let pcSocket = null;

server.on('connection', (socket, req) => {
  const url = req.url;
  console.log(`🔌 New connection on ${url}`);

  if (url === '/frompc') {
    console.log("💻 PC connected");
    pcSocket = socket;

    socket.on('close', () => {
      console.log("💻 PC disconnected");
      pcSocket = null;
    });

  } else if (url === '/fromclient') {
    console.log("📱 Client connected");

    socket.on('message', (msg) => {
      console.log("📥 Message from client:", msg);
      if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
        pcSocket.send(msg);
        console.log("➡️ Relayed to PC");
      } else {
        console.log("⚠️ No PC connected. Dropping message.");
      }
    });

    socket.on('close', () => {
      console.log("📱 Client disconnected");
    });

  } else {
    console.log(`❌ Unknown path: ${url}`);
    socket.close();
  }
});
