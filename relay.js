const WebSocket = require('ws');

const server = new WebSocket.Server({ port: process.env.PORT || 10000 });

let pcSocket = null;

server.on('connection', (socket, req) => {
  const url = req.url;

  if (url === '/frompc') {
    console.log("💻 PC Connected");
    pcSocket = socket;

    socket.on('close', () => {
      pcSocket = null;
    });

  } else if (url === '/fromclient') {
    console.log("📱 Client Connected");

    socket.on('message', (msg) => {
      if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
        pcSocket.send(msg);
      }
    });
  }
});
